import express from 'express';
import { check, validationResult } from 'express-validator/check';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { secretkey } from '../../config/keys';
import User from '../../models/users';

const router = express.Router();

router.get('/', (req, res) => {
  User.find()
    .then(users => res.json(users));
});

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
      return res.status(400).json({ errors: [{ msg: 'user already exists' }] });
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
      (err, token) => {
        if (err) {
          console.log(err);
          return null;
        }
        return res.send({ token });
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

export default router;
