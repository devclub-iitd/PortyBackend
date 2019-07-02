import express from 'express';
import { check, validationResult } from 'express-validator/check';
import bcrypt from 'bcryptjs';
import jwt, { verify } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { secretkey } from '../../config/keys';
import User from '../../models/users';
import 'babel-polyfill';


const router = express.Router();

// find all users
router.get('/', (req, res) => {
  User.find()
    .then(users => res.json(users));
});

// create a new user
router.post('/', [
  check('name', 'Name is Required').not().isEmpty(),
  check('email', 'Not Valid Email').isEmail(), // here we need to add valid IIT email address,so I need to add condtions for that also
  check('password', 'Password is Required').not().isEmpty(),

  // similarly we can add more if we want
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // see if user exists
    const { email } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({ errors: [{ msg: 'user already exists' }] });
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

    jwt.sign(payload, secretkey, { expiresIn: 3600 },
      async (err, token) => {
        if (err) {
          console.log(err);
          return null;
        }
        // return res.send({ token });

        // here send the mail
        try {
          const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
              user: 'pearl.osinski81@ethereal.email',
              pass: 'HnhJH9D6QVSCcQAuEp',
            },
          });

          // send mail with defined transport object
          const info = await transporter.sendMail({
            from: '"jatinprakash 👻" <jatin000005@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: 'Hello ✔', // Subject line
            text: `http://localhost:5000/api/user/verify/${token}`, // plain text body
            html: `<b>http://localhost:5000/api/user/verify/${token}</b>`, // html body
          });

          console.log('Message sent: %s', info.messageId);


          // Preview only available when sending through an Ethereal account
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));


          
          return res.json({ msg: 'We have sent email containing otp' });
        } catch (err_) {
          console.log(err_);
        }

        return null;
      });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }

  return null;
});

router.delete('/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id, (err) => {
    if (err) res.status(404).json({ success: false });
    else res.json({ success: true });
  });
});

router.get('/verify/:jwt', async (req, res) => {
  const token = req.params.jwt;

  if (!token) {
    return res.status(401).json({ msg: 'Authorization denied as no token present' });
  }

  try {
    const decoded = verify(token, secretkey);
    // this will give us the user:id in req.user.id
    const founduser = await User.findById(decoded.user.id).select('-password');

    founduser.isverified = true;

    // console.log(founduser);
    await founduser.save();

    res.status(200).json({ msg: 'Your account has been verified..Please login to access your account' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Token not valid' });
  }

  return null;
});

export default router;
