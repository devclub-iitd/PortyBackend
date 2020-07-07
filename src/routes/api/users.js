// TODO fix return problems
/* eslint-disable consistent-return */

import express from 'express';
import { check, validationResult } from 'express-validator/check';
import bcrypt from 'bcryptjs';
import jwt, { verify } from 'jsonwebtoken';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import secretkey from '../../config/keys';
import User from '../../models/users';

const { OAuth2 } = google.auth;

const router = express.Router();

// find all users
router.get('/', (req, res) => {
    User.find().then((users) => res.json(users));
});

// this is to regenerate otp
router.post(
    '/otp',
    [
        check('email', 'Email is Required').not().isEmpty(),
        // check('email', 'Not Valid Email').isEmail(), // here we need to add valid IIT email address,so I need to add condtions for that also
        // check("password", "Password is Required")
        //   .not()
        //   .isEmpty()  //pass s not required
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // see if user exists
            const { email } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({
                    errors: [{ msg: 'No user exists with the given email' }],
                });
            }

            if(user.isverified) {
                return res.status(400).json({
                    errors: [{ msg: 'Your account has already been verified' }],
                });
            }

            // return webtoken
            const payload = {
                user: {
                    id: user.id, // with this we can access req.user.id
                },
            };

            jwt.sign(
                payload,
                secretkey,
                { expiresIn: 3600 },
                async (err, token) => {
                    if (err) {
                        console.log(err);
                        return null;
                    }
                    // return res.send({ token });

                    // here send the mail
                    try {
                        const oauth2Client = new OAuth2(
                            process.env.CLIENT_ID, // ClientID
                            process.env.CLIENT_SECRET, // Client Secret
                            'https://developers.google.com/oauthplayground' // Redirect URL
                        );

                        oauth2Client.setCredentials({
                            refresh_token: process.env.REFRESH_TOKEN,
                        });

                        const accessToken = oauth2Client.getAccessToken();

                        const transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            service: 'Gmail',
                            auth: {
                                type: 'OAuth2',
                                user: 'portfoliocreatoriitd@gmail.com',
                                clientId: process.env.CLIENT_ID,
                                clientSecret: process.env.CLIENT_SECRET,
                                refreshToken: process.env.REFRESH_TOKEN,
                                accessToken,
                            },
                        });

                        // send mail with defined transport object
                        const info = await transporter.sendMail({
                            from:
                                '"Portfolio Creator👻" <portfoliocreatoriitd@gmail.com>', // sender address
                            to: user.email, // list of receivers
                            subject: 'Email Verification', // Subject line
                            // text: `https://porty-backend-devclub.herokuapp.com/api/user/verify/${token}`, // plain text body
                            html: `<h3>Click on the link below to verify your account.</h3>
              <p>
                  <a href="https://porty-backend-devclub.herokuapp.com/api/user/verify/${token}">Click Here</a>
              </p>`, // html body
                        });

                        console.log('Message sent: %s', info.messageId);

                        // Preview only available when sending through an Ethereal account
                        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                        return res.json({
                            msg: 'We have sent email containing otp',
                        });
                    } catch (err_) {
                        console.log(err_);
                        res.status(500).json({
                            errors: [{ msg: 'Servor Error' }],
                        });
                    }

                    return null;
                }
            );
        } catch (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: 'Servor Error' }] });
        }
    }
);

// create a new user
router.post(
    '/',
    [
        check('name', 'Name is Required').not().isEmpty(),
        // check('email', 'Not Valid Email').isEmail(), // here we need to add valid IIT email address,so I need to add condtions for that also
        check('password', 'Password is Required').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // see if user exists
            const { email, entryno } = req.body;

            // if(!email.endsWith("@iitd.ac.in")){
            //   return res.status(400).json({ errors: [{ msg: 'Not a valid IITD email address,it should end with a @iitd.ac.in' }] });
            // }

            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({
                    errors: [{ msg: 'User already exists with same email' }],
                });
            }

            user = await User.findOne({ entryno });

            if (user) {
                return res.status(400).json({
                    errors: [
                        { msg: 'User already exists with same entry number' },
                    ],
                });
            }

            user = new User(req.body);

            // also need to add email verifier via otp

            // encrypt the password using bcrypt
            const salt = await bcrypt.genSalt(10); // which to use 10 or more than that

            user.password = await bcrypt.hash(user.password, salt);

            await user.save();

            // res.json(user)

            // return webtoken
            const payload = {
                user: {
                    id: user.id, // with this we can access req.user.id
                },
            };

            jwt.sign(
                payload,
                secretkey,
                { expiresIn: 3600 },
                async (err, token) => {
                    if (err) {
                        console.log(err);
                        return null;
                    }
                    // return res.send({ token });

                    // here send the mail
                    try {
                        const oauth2Client = new OAuth2(
                            process.env.CLIENT_ID, // ClientID
                            process.env.CLIENT_SECRET, // Client Secret
                            'https://developers.google.com/oauthplayground' // Redirect URL
                        );

                        oauth2Client.setCredentials({
                            refresh_token: process.env.REFRESH_TOKEN,
                        });

                        const accessToken = oauth2Client.getAccessToken();

                        const transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            service: 'Gmail',
                            auth: {
                                type: 'OAuth2',
                                user: 'portfoliocreatoriitd@gmail.com',
                                clientId: process.env.CLIENT_ID,
                                clientSecret: process.env.CLIENT_SECRET,
                                refreshToken: process.env.REFRESH_TOKEN,
                                accessToken,
                            },
                        });

                        // send mail with defined transport object
                        const info = await transporter.sendMail({
                            from:
                                '"Portfolio Creator👻" <portfoliocreatoriitd@gmail.com>', // sender address
                            to: user.email, // list of receivers
                            subject: 'Email Verification', // Subject line
                            // text: `https://porty-backend-devclub.herokuapp.com/api/user/verify/${token}`, // plain text body
                            html: `<h3>Click on the link below to verify your account.</h3>
            <p>
                <a href="https://porty-backend-devclub.herokuapp.com/api/user/verify/${token}">Click Here</a>
            </p>`, // html body
                        });

                        console.log('Message sent: %s', info.messageId);

                        // Preview only available when sending through an Ethereal account
                        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                        return res.json({
                            msg: 'We have sent email containing otp',
                        });
                    } catch (err_) {
                        console.log(err_);
                        try {
                            await user.delete();
                        } catch (err__) {
                            console.log(err__);
                            res.json({
                                msg:
                                    'Fatal Error Occured. Please Contact Support.',
                            });
                        }
                    }

                    return null;
                }
            );
        } catch (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }

        return null;
    }
);

router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id, (err) => {
        if (err) res.status(404).json({ success: false });
        else res.json({ success: true });
    });
});

router.get('/verify/:jwt', async (req, res) => {
    const token = req.params.jwt;

    if (!token) {
        return res
            .status(401)
            .json({ msg: 'Authorization denied as no token present' });
    }

    try {
        const decoded = verify(token, secretkey);
        // this will give us the user:id in req.user.id
        const founduser = await User.findById(decoded.user.id).select(
            '-password'
        );

        founduser.isverified = true;

        await founduser.save();
        res.redirect('https://portfolio.devclub.in/validate');
        res.status(200).json({
            msg:
                'Your account has been verified..Please login to access your account',
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Token not valid' });
    }
});

// create forgot password
router.post(
    '/forgot',
    [
        check('email', 'Email is Required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(),
        // check('email', 'Not Valid Email').isEmail(), // here we need to add valid IIT email address,so I need to add condtions for that also
        // check("password", "Password is Required")
        //   .not()
        //   .isEmpty()  //pass s not required
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // see if user exists
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({
                    errors: [{ msg: 'No user exists with the given email' }],
                });
            }

            // return webtoken
            const payload = {
                user: {
                    id: user.id, // with this we can access decoded.user.id
                    password,
                },
            };

            jwt.sign(
                payload,
                secretkey,
                { expiresIn: 3600 },
                async (err, token) => {
                    if (err) {
                        console.log(err);
                        return null;
                    }
                    // return res.send({ token });

                    // here send the mail
                    try {
                        const oauth2Client = new OAuth2(
                            process.env.CLIENT_ID, // ClientID
                            process.env.CLIENT_SECRET, // Client Secret
                            'https://developers.google.com/oauthplayground' // Redirect URL
                        );

                        oauth2Client.setCredentials({
                            refresh_token: process.env.REFRESH_TOKEN,
                        });

                        const accessToken = oauth2Client.getAccessToken();

                        const transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            service: 'Gmail',
                            auth: {
                                type: 'OAuth2',
                                user: 'portfoliocreatoriitd@gmail.com',
                                clientId: process.env.CLIENT_ID,
                                clientSecret: process.env.CLIENT_SECRET,
                                refreshToken: process.env.REFRESH_TOKEN,
                                accessToken,
                            },
                        });

                        // send mail with defined transport object
                        const info = await transporter.sendMail({
                            from:
                                '"Portfolio Creator👻" <portfoliocreatoriitd@gmail.com>', // sender address
                            to: user.email, // list of receivers
                            subject: 'Email Verification', // Subject line
                            // text: `https://porty-backend-devclub.herokuapp.com/api/user/verify/${token}`, // plain text body
                            html: `<h3>Click on the link below to change your password.</h3>
              <p>
                  <a href="https://porty-backend-devclub.herokuapp.com/api/user/verify/forgot/${token}">Click Here</a>
              </p>`, // html body
                        });

                        console.log('Message sent: %s', info.messageId);

                        // Preview only available when sending through an Ethereal account
                        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                        return res.json({
                            msg: 'We have sent email containing otp',
                        });
                    } catch (err_) {
                        console.log(err_);
                        res.status(500).json({
                            errors: [{ msg: 'Servor Error' }],
                        });
                    }

                    return null;
                }
            );
        } catch (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: 'Servor Error' }] });
        }
    }
);

router.get('/verify/forgot/:jwt', async (req, res) => {
    const token = req.params.jwt;

    if (!token) {
        return res
            .status(401)
            .json({ msg: 'Authorization denied as no token present' });
    }

    try {
        const decoded = verify(token, secretkey);
        // this will give us the user:id in req.user.id
        const founduser = await User.findById(decoded.user.id);

        founduser.password = decoded.user.password;
        // encrypt the password using bcrypt
        const salt = await bcrypt.genSalt(10); // which to use 10 or more than that

        founduser.password = await bcrypt.hash(founduser.password, salt);

        await founduser.save();
        res.redirect('https://portfolio.devclub.in/resetSucc');
        res.status(200).json({
            msg: 'Your password has been changed...',
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Token not valid' });
    }
});

export default router;
