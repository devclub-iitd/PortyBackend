import express from 'express';
import auth from '../../middleware/auth';
import Profile from '../../models/profile';
import User from '../../models/users'
const fs = require('fs');

const router = express.Router();

// get profile by id for public access by accessing api/profile/user/:user_id
router.get('/user/:en', async (req, res) => {
  try {
    //await User.findByIdAndDelete("5ddbd5ee09a9bd49c3c7a83c");
    //console.log(req.params.en)
    const user_found = await User.findOne({entryno : `${req.params.en}`})
    //console.log("hello")
    //console.log(user_found)
    if(!user_found) return res.status(400).json({ msg: 'User doesnt exists' });
    
    const profile = await Profile.findOne({ user : user_found._id }).populate(
      'user',
      ['name', 'email','entryno'],
    );
    //console.log(profile)
    // console.log(profile);
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

// get profile for logged in user by accessing api/profile/me carrying a jwt
router.get('/me', auth, async (req, res) => {
  try {
    const profileUser = await Profile.findOne({ user: req.user.id }).populate('user',
      ['name', 'email']);

    if (!profileUser) {
      return res.status(400).json({ msg: "User hasn't set up his/her profile yet" });
    } 

    // var newprof = {
    //   user : profileUser.user,
    //   about : profileUser.about,
    //   location : profileUser.location,
    //   education : [],
    //   work : [],
    //   volunteer : [],
    //   awards : [],
    //   publications : [],
    //   skills : [],
    //   languages : [],
    //   interests : [],
    //   references : []
    // }
    // var temp_work = profileUser.work;
    // for(var i=0;i<temp_work.length;i++){
    //   if(!temp_work[i].hidden) newprof.work.push(temp_work[i]);
    // }

    // var temp_volunteer = profileUser.volunteer;
    // for(var i=0;i<temp_volunteer.length;i++){
    //   if(!temp_volunteer[i].hidden) newprof.volunteer.push(temp_volunteer[i]);
    // }

    // var temp_awards = profileUser.awards;
    // for(var i=0;i<temp_awards.length;i++){
    //   if(!temp_awards[i].hidden) newprof.awards.push(temp_awards[i]);
    // }

    // var temp_publications = profileUser.publications;
    // for(var i=0;i<temp_publications.length;i++){
    //   if(!temp_publications[i].hidden) newprof.publications.push(temp_publications[i]);
    // }

    // var temp_skills = profileUser.skills;
    // for(var i=0;i<temp_skills.length;i++){
    //   if(!temp_skills[i].hidden) newprof.skills.push(temp_skills[i]);
    // }

    // var temp_languages = profileUser.languages;
    // for(var i=0;i<temp_languages.length;i++){
    //   if(!temp_languages[i].hidden) newprof.languages.push(temp_languages[i]);
    // }

    // var temp_interests = profileUser.interests;
    // for(var i=0;i<temp_interests.length;i++){
    //   if(!temp_interests[i].hidden) newprof.interests.push(temp_interests[i]);
    // }

    // var temp_references = profileUser.references;
    // for(var i=0;i<temp_references.length;i++){
    //   if(!temp_references[i].hidden) newprof.references.push(temp_references[i]);
    // }

    fs.writeFile('file.json', JSON.stringify({profile : profileUser}), (err) => {
      // throws an error, you could also catch it here
      if (err) return res.status(500).send('Server Error');
    });
    
    return res.json(profileUser);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

router.get('/mefull', auth, async (req, res) => {
  try {
    const profileUser = await Profile.findOne({ user: req.user.id }).populate('user',
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

router.get('/download', (req, res) => res.download('./file.json'))


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
    dob,
    about
} = req.body;

  // Build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (dob) profileFields.dob = dob;
  if (about) profileFields.about = about;
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



export default router;
