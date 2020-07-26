// middleware function to use to interact with auth server
const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// SSO Url for refreshing tokens that are about to expire
const SSO_Refresh_URL = 'http://localhost:8000/auth/refresh-token';

// Client url, this string should be equal to the exact base URL of the client
// in our case we want to redirect to frontend
const clientURL = 'http://localhost:3000';

const accessTokenName = 'token'; // The default JWT token name
const refreshTokenName = 'rememberme'; // Name for remember me style tokens

const publicKey = fs.readFileSync(path.resolve(__dirname, './public.pem')); // Public Key path

// Max time remaining for token expiry, after which a refresh request will be sent to the SSO for refreshing the token
const maxTTL = 2 * 60; // 5 minutes

const UnauthorizedHandler = (req,res) => {
    return res.status(401).json( {msg : "Alas You are out of scope! Go get some more permissions dude"} );
}

const ROLES = {
    '*' : ['external_user'],
    '/admin': ['dc_core','admin']
}

// Push the redirectURL to public paths array as the redirectURL should be accessible to all users
publicPaths.push(redirectURL);

const auth = async (req, res, next) => {
    // Extract tokens from cookies
    const token = req.cookies[accessTokenName];
    const refreshToken = req.cookies[refreshTokenName];

    try {
        let decoded;
        if (!token) {
            if (!refreshToken) {
                throw jwt.JsonWebTokenError;
            }
            decoded = await jwt.verify(refreshToken, publicKey, {
                algorithms: ['RS256']
            });
            
            // Send a refresh request to the SSO Server if the time remaining is less than maxTTL
            const response = await axios.post(SSO_Refresh_URL, { rememberme: refreshToken })
            res.setHeader('set-cookie',response.headers['set-cookie'])
            

        } else {
            decoded = await jwt.verify(token, publicKey, {
                algorithms: ['RS256']
            });
            const tokenAgeRemaining = decoded.exp - Math.floor(Date.now() / 1000);
            if (tokenAgeRemaining <= maxTTL) {
                console.log("refreshing token, since it is about to expire!")
                const response = await axios.post(SSO_Refresh_URL, { token })
                res.setHeader('set-cookie', response.headers['set-cookie'])
            }
        }

        if(isAuthorized(req,decoded.user)) { 
            req.user = decoded.user;
            next();
        }
        else return UnauthorizedHandler(req,res);

    } catch (error) {
        req.user = null;
        res.clearCookie(accessTokenName);
        res.clearCookie(refreshTokenName);

        return res.status(401).json({ msg : "Not authorized as not logged in..."})
        
    }
    
};

const isAuthorized = (req,user) => {
    if(Object.keys(ROLES).includes(req.url)){
        for (const index in ROLES[req.url]) {
            if (!user.roles.includes(ROLES[req.url][index])) return false;
        }
        return true;
    }
    if(Object.keys(ROLES).includes('*')){
        for (const index in ROLES['*']) {
            if (!user.roles.includes(ROLES['*'][index])) return false;
        }
    }
    return true;
}

module.exports = auth;