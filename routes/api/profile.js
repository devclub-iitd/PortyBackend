const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/users')
const Profile = require('../../models/profile')
const { check, validationResult } = require('express-validator/check')


//get profile for logged in user by accessing api/profile/me carrying a jwt 
router.get('/me',auth,async function(req,res) {
    try {
        const profile_user = await Profile.find({user:req.user.id}).populate('user',
        ['name','email'])
        
        if(!profile_user){
           return res.status(401).json({msg:"User hasn't set up his/her profile yet"})
        } 

        res.json(profile_user);

    }catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
})



//post to a user id
router.post('/',auth,async function(req,res){
    const {
        entryno,
        age,
        dob,
        phone,
        education
    } = req.body

    //Build profile object
    const profileFields = {}
    profileFields.user = req.user.id
    profileFields.entryno = entryno
    profileFields.age = age
    profileFields.phone = phone
    profileFields.education = education

    try {
        let profile = await Profile.findOne({user:req.user.id})
        if(profile){
            // we need to update
            profile = await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set: profileFields},
                {new:true}
            )
            return res.json(profile)
        }
        
        profile = new Profile(profileFields)

        await profile.save()

        res.json(profile)



    } catch (err) {
        console.log(err)
        res.status(500).send("Server Error")
    }
})

//get profile by id for public access by accessing api/profile/user/:user_id
router.get('/user/:user_id',async (req,res) => {
    try {
        const profile = await Profile.find({ user : req.params.user_id}).populate(
            'user',
            ['name','email']
        )
        if(!profile) return res.status(400).json({msg:"Profile not found for this user"})
        
        res.json(profile)

    } catch (error) {
        console.log(error)
        if(error.kind == 'ObjectId'){
            return res.status(400).json({ msg: "Profile not found for this user" })
        }
        res.status(500).send("Server error")
    }
})

module.exports = router;