import Profile from '../models/profile';

// move this to utils
export const timeout = (TimeInMs) => {
    return new Promise(resolve => setTimeout(resolve, TimeInMs));
}

export const getProfile = async (res, sso_id) => {
    try {
        const profileUser = await Profile.findOne({
            sso_id
        });

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

        return newprof;

    } catch (err) {
        console.log(err);
        return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
}