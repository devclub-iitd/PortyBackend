// TODO fix return problems
/* eslint-disable consistent-return */

import express from 'express';
import auth from '../../middleware/auth'

const router = express.Router();

// find all users, also to check if someone logged in or not
router.get('/', auth, (req, res) => {
    return res.json(req.user);
});

export default router;
