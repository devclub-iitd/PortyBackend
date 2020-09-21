// TODO fix return problems
/* eslint-disable consistent-return */

import express from 'express';
import auth from '../../middleware/auth'
import { Octokit } from '@octokit/rest'
import axios from 'axios'

const router = express.Router();

// find all users, also to check if someone logged in or not
router.get('/', auth, (req, res) => {
    return res.json(req.user);
});

// route that hits the callback from github oauth
// for now only signed in users can do this
router.get('/github_deploy', auth, async (req, res) => {
    const { code, theme } = req.query;

    try {
        
        // now try to get the access token first -------------------------
        // https://github.com/login/oauth/access_token

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const payload = {
            client_id : '',
            client_secret : '',
        }

        const { accessToken } = await axios.post(
            'https://github.com/login/oauth/access_token', 
            payload, 
            config
        );

        // create octokit object now using the accesstoken ------------------
        const octokit = new Octokit({
            auth: accessToken,
        });

        // now delete the repo if possible -----------------------
        const { data } = await octokit.request("/user");
        const user_name = data.login;
        const repo_name = user_name + ".github.io"

        // console.log(repo_name)
        console.log("Got the user data")

        const response = await octokit.repos.listForUser({
            username : user_name,
            type : "public"
        })

        const repo_list = response.data;

        // console.log(repo_list)

        var ok = 0;

        repo_list.forEach(repo => {
            if(repo.name == repo_name) {
                ok = 1;
            }
        });

        if(ok) {
            // only now need to delete the repo
            await octokit.repos.delete({
                owner : user_name,
                repo : repo_name,
            });
    
            console.log("repo deleted")
        }

        // create the new repo -------------------

        // update file.json --------------------

        // redirect to frontend --------------------

    }
    catch(err) {
        console.log(err)
    }
})

export default router;
