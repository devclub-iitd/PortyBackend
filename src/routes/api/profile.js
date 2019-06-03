import express from 'express';
import auth from '../../middleware/auth';
import Profile from '../../models/profile';

const router = express.Router();

// get profile for logged in user by accessing api/profile/me carrying a jwt
router.get('/me', auth, async (req, res) => {
  try {
    const profileUser = await Profile.find({ user: req.user.id }).populate('user',
      ['name', 'email']);

    if (!profileUser) {
      return res.status(401).json({ msg: "User hasn't set up his/her profile yet" });
    }

    return res.json(profileUser);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});


// post to a user id
router.post('/', auth, async (req, res) => {
  const {
    entryno,
    age,
    phone,
    education,
  } = req.body;

  // Build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  profileFields.entryno = entryno;
  profileFields.age = age;
  profileFields.phone = phone;
  profileFields.education = education;

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      // we need to update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true },
      );
      return res.json(profile);
    }

    profile = new Profile(profileFields);

    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

// get profile by id for public access by accessing api/profile/user/:user_id
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.find({ user: req.params.user_id }).populate(
      'user',
      ['name', 'email'],
    );
    if (!profile) return res.status(400).json({ msg: 'Profile not found for this user' });

    return res.json(profile);
  } catch (error) {
    console.log(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found for this user' });
    }
    return res.status(500).send('Server error');
  }
});

export default router;
