import express from 'express';
import { check, validationResult } from 'express-validator/check';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../../middleware/auth';
import { secretkey } from '../../config/keys';
import User from '../../models/users';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// login
router.post('/', [
  check('email', 'email is Required').not().isEmpty(),
  check('password', 'password is Required').not().isEmpty(),

  // similarly we can add more if we want
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // see if user exists
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'invalid login details' }] });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'invalid login details' }] });
    }

    if (!user.isverified) {
      return res.status(400).json({ erros: [{ msg: 'Your account has not been verified' }] });
    }

    // return webtoken
    const payload = {
      user: {
        id: user.id,
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


export default router;
