import express from 'express';
import auth from '../../middleware/auth';

const router = express.Router();

// mainly used to check if someone is logged in or not
router.get('/', auth, async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        res.clearCookie('token');
        res.clearCookie('rememberme');
        return res.status(200).json({msg : 'Logged out!!'});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

export default router;
