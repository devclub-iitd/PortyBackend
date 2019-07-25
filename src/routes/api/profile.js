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
      return res.status(400).json({ msg: "User hasn't set up his/her profile yet" });
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
    work,
    location,
    volunteer,
    awards,
    skills,
    languages,
    interests,
    references,
    publications,
    dob
} = req.body;

  // Build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (dob) profileFields.dob = dob;
  if (entryno) profileFields.entryno = entryno;
  if (age) profileFields.age = age;
  if (phone) profileFields.phone = phone;
  if (education) profileFields.education = education;
  if (work) profileFields.work = work;
  if (volunteer) profileFields.volunteer = volunteer;
  if (awards) profileFields.awards = awards;
  if (publications) profileFields.publications = publications;
  if (skills) profileFields.skills = skills;
  if (languages) profileFields.languages = languages;
  if (interests) profileFields.interests = interests;
  if (references) profileFields.references = references;
  if (location) profileFields.location = location;

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
