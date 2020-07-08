// TODO: Fix return problem
/* eslint-disable consistent-return */

import express from 'express';
import auth from '../../middleware/auth';
import Profile from '../../models/profile';
import User from '../../models/users';

const fs = require('fs');

const router = express.Router();

// get profile for logged in user by accessing api/profile/me carrying a jwt
router.get('/me', auth, async (req, res) => {
    try {
        const profileUser = await Profile.findOne({
            user: req.user.id,
        }).populate('user', ['name', 'email']);

        if (!profileUser) {
            return res
                .status(400)
                .json({ msg: "User hasn't set up his/her profile yet" });
        }

        const newprof = {
            user: profileUser.user,
            about: profileUser.about,
            location: profileUser.location,
            education: [],
            work: [],
            volunteer: [],
            awards: [],
            publications: [],
            skills: [],
            languages: [],
            interests: [],
            references: [],
        };
        let i = 0;

        let wc = 0;
        let ec = 0;

        const tempWork = profileUser.work;
        for (i = 0; i < tempWork.length; i += 1) {
            if (!tempWork[i].hidden) {newprof.work.push(tempWork[i]); wc += 1;}
        }

        const tempEducation = profileUser.education;
        for (i = 0; i < tempEducation.length; i += 1) {
            if (!tempEducation[i].hidden)
                {newprof.education.push(tempEducation[i]); ec += 1;}
        }

        const tempVolunteer = profileUser.volunteer;
        for (i = 0; i < tempVolunteer.length; i += 1) {
            if (!tempVolunteer[i].hidden)
                newprof.volunteer.push(tempVolunteer[i]);
        }

        const tempAwards = profileUser.awards;
        for (i = 0; i < tempAwards.length; i += 1) {
            if (!tempAwards[i].hidden) newprof.awards.push(tempAwards[i]);
        }

        const tempPublications = profileUser.publications;
        for (i = 0; i < tempPublications.length; i += 1) {
            if (!tempPublications[i].hidden)
                newprof.publications.push(tempPublications[i]);
        }

        const tempSkills = profileUser.skills;
        for (i = 0; i < tempSkills.length; i += 1) {
            if (!tempSkills[i].hidden) newprof.skills.push(tempSkills[i]);
        }

        const tempLanguages = profileUser.languages;
        for (i = 0; i < tempLanguages.length; i += 1) {
            if (!tempLanguages[i].hidden)
                newprof.languages.push(tempLanguages[i]);
        }

        const tempInterests = profileUser.interests;
        for (i = 0; i < tempInterests.length; i += 1) {
            if (!tempInterests[i].hidden)
                newprof.interests.push(tempInterests[i]);
        }

        const tempReferences = profileUser.references;
        for (i = 0; i < tempReferences.length; i += 1) {
            if (!tempReferences[i].hidden)
                newprof.references.push(tempReferences[i]);
        }

        if(wc == 0 || ec == 0) {
            return res.status(400).json({
                msg : 'Please select one or more education and work experience to be not hidden'
            })
        }

        return res.json(newprof);

    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error');
    }
});

router.get('/mefull', auth, async (req, res) => {
    try {
        const profileUser = await Profile.findOne({
            user: req.user.id,
        }).populate('user', ['name', 'email']);

        if (!profileUser) {
            return res
                .status(400)
                .json({ msg: "User hasn't set up his/her profile yet" });
        }
        return res.json(profileUser);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error');
    }
});

router.get('/download', async (req, auth, res) => {
    try {
        const profileUser = await Profile.findOne({
            user: req.user.id,
        }).populate('user', ['name', 'email']);

        if (!profileUser) {
            return res
                .status(400)
                .json({ msg: "User hasn't set up his/her profile yet" });
        }

        const newprof = {
            user: profileUser.user,
            about: profileUser.about,
            location: profileUser.location,
            education: [],
            work: [],
            volunteer: [],
            awards: [],
            publications: [],
            skills: [],
            languages: [],
            interests: [],
            references: [],
        };
        let i = 0;

        const tempWork = profileUser.work;
        for (i = 0; i < tempWork.length; i += 1) {
            if (!tempWork[i].hidden) newprof.work.push(tempWork[i]);
        }

        const tempEducation = profileUser.education;
        for (i = 0; i < tempEducation.length; i += 1) {
            if (!tempEducation[i].hidden)
                newprof.education.push(tempEducation[i]);
        }

        const tempVolunteer = profileUser.volunteer;
        for (i = 0; i < tempVolunteer.length; i += 1) {
            if (!tempVolunteer[i].hidden)
                newprof.volunteer.push(tempVolunteer[i]);
        }

        const tempAwards = profileUser.awards;
        for (i = 0; i < tempAwards.length; i += 1) {
            if (!tempAwards[i].hidden) newprof.awards.push(tempAwards[i]);
        }

        const tempPublications = profileUser.publications;
        for (i = 0; i < tempPublications.length; i += 1) {
            if (!tempPublications[i].hidden)
                newprof.publications.push(tempPublications[i]);
        }

        const tempSkills = profileUser.skills;
        for (i = 0; i < tempSkills.length; i += 1) {
            if (!tempSkills[i].hidden) newprof.skills.push(tempSkills[i]);
        }

        const tempLanguages = profileUser.languages;
        for (i = 0; i < tempLanguages.length; i += 1) {
            if (!tempLanguages[i].hidden)
                newprof.languages.push(tempLanguages[i]);
        }

        const tempInterests = profileUser.interests;
        for (i = 0; i < tempInterests.length; i += 1) {
            if (!tempInterests[i].hidden)
                newprof.interests.push(tempInterests[i]);
        }

        const tempReferences = profileUser.references;
        for (i = 0; i < tempReferences.length; i += 1) {
            if (!tempReferences[i].hidden)
                newprof.references.push(tempReferences[i]);
        }

        if(wc == 0 || ec == 0) {
            return res.status(400).json({
                msg : 'Please select one or more education and work experience to be not hidden'
            })
        }

        fs.writeFile(
            'file.json',
            JSON.stringify({ profile: newprof }),
            (err) => {
                // throws an error, you could also catch it here
                if (err) return res.status(500).send('Server Error');
            }
        );
        
        return res.download('./file.json')
        
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error');
    }
})

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
        about,
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
                { new: true }
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
