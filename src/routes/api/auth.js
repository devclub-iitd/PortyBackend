import express from 'express';
import auth from '../../middleware/auth';

const router = express.Router();

// mainly used to check if someone is logged in or not
router.get('/', auth, async (req, res) => {
    try {
        const user = req.user;
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

export default router;
