const express = require('express')
const router = express.Router()
const { check , validationResult } = require('express-validator/check')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config/keys')
const User = require('../../models/users')

router.get('/',function(req,res){
    User.find()
        .then(users => res.json(users))
})

router.post('/',[
    check('name',"Name is Required").not().isEmpty(),
    check('email', "Not Valid Email").isEmail(),  //here we need to add valid IIT email address,so I need to add condtions for that also
    check('password', "Password is Required").not().isEmpty()

    //similarly we can add more if we want
],async function(req,res) {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() })
    }
    
    try{
        //see if user exists
        const email = req.body.email
        let user = await User.findOne({'email': email})

        if(user){
            res.status(400).json({errors:[{msg:"user already exists"}]})
        }

        user = new User(req.body)   

        //also need to add email verifier via otp

         //encrypt the password using bcrypt
        const salt = await bcrypt.genSalt(10)  //which to use 10 or more than that
        
        user.password = await bcrypt.hash(user.password,salt)

        await user.save()

        //res.json(user)
        
        //return webtoken
        const payload = {
            user:{
                id : user.id   //with this we can access req.user.id
            }
        }

        jwt.sign(payload,config.secretkey,{expiresIn:3600},
            (err,token) => {
                if(err) console.log(err)
                else res.send({token})
            })
        
    }catch(err){
        console.log(err);
        res.status(500).send("Server error")
    }
})

router.delete('/:id',function(req,res){
    User.findByIdAndDelete(req.params.id,function(err) {
        if(err) res.status(404).json({success:false})
        else res.json({success:true})
    })
})

module.exports = router