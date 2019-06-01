const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator/check')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config/keys')

const User = require('../../models/users')

router.get('/',auth,async (req,res) => {
    try{
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)

    }catch(err){
        console.error(err)
        res.status(500).send("Server error")
    }
})

router.post('/', [
    check('email', "email is Required").not().isEmpty(),
    check('password', "password is Required").not().isEmpty()

    //similarly we can add more if we want
], async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        //see if user exists
        const email = req.body.email
        let user = await User.findOne({ 'email': email })

        if (!user) {
            return res.status(400).json({ errors: [{ msg: "invalid login details" }] })
        }

        const isMatch = await bcrypt.compare(req.body.password,user.password)

        if(!isMatch){
            return res.status(400).json({ errors: [{ msg: "invalid login details" }] })
        }

        //return webtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.secretkey, { expiresIn: 3600 },
            (err, token) => {
                if (err) console.log(err)
                else res.send({ token })
            })

    } catch (err) {
        console.log(err);
        res.status(500).send("Server error")
    }
})


module.exports = router