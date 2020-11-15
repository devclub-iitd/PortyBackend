// middleware function to use to interact with auth server
const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// SSO Url for refreshing tokens that are about to expire
const SSO_Refresh_URL = process.env.SSO_REFRESH_URL;

const accessTokenName = 'token'; // The default JWT token name
const refreshTokenName = 'rememberme'; // Name for remember me style tokens

const publicKey = fs.readFileSync(path.resolve(__dirname, './public.pem')); // Public Key path

// Max time remaining for token expiry, after which a refresh request will be sent to the SSO for refreshing the token
const maxTTL = 2 * 60; // 5 minutes

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
                algorithms: ['RS256'],
            });

            // Send a refresh request to the SSO Server if the time remaining is less than maxTTL
            const response = await axios.post(SSO_Refresh_URL, {
                rememberme: refreshToken,
            });
            res.setHeader('set-cookie', response.headers['set-cookie']);
        } else {
            decoded = await jwt.verify(token, publicKey, {
                algorithms: ['RS256'],
            });
            const tokenAgeRemaining =
                decoded.exp - Math.floor(Date.now() / 1000);
            if (tokenAgeRemaining <= maxTTL) {
                console.log('refreshing token, since it is about to expire!');
                const response = await axios.post(SSO_Refresh_URL, { token });
                res.setHeader('set-cookie', response.headers['set-cookie']);
            }
        }
        // all went well, proceed
        req.user = decoded.user;
        next();
    } catch (error) {
        req.user = null;
        res.clearCookie(accessTokenName);
        res.clearCookie(refreshTokenName);

        return res
            .status(401)
            .json({ msg: 'Not authorized as not logged in...' });
    }
};

module.exports = auth;
