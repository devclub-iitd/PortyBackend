// TODO fix return problems
/* eslint-disable consistent-return */

import express from 'express';
import auth from '../../middleware/auth'
import { Octokit } from '@octokit/rest'
import axios from '../../utils/axios'
import queryString from 'query-string'
import { getProfile, timeout } from '../../utils/utils'

const router = express.Router();

// find all users, also to check if someone logged in or not
router.get('/', auth, (req, res) => {
    return res.json(req.user);
});

// route that hits the callback from github oauth
// for now only signed in users can do this
router.get('/github_deploy', auth, async (req, res) => {

    const { code, theme } = req.query;
    console.log("theme is " + theme);

    try {

        // get user data first
        // get the userdata
        const profileResponse = await getProfile(res, req.user.id);
        const profileCorrect = {
            profile : profileResponse
        };
        const profileString = JSON.stringify(profileCorrect);
        // const profileString = 'hello';
        

        // now try to get the access token first -------------------------
        // https://github.com/login/oauth/access_token

        const payload = {
            client_id : process.env.CLIENT_ID,
            client_secret : process.env.CLIENT_SECRET,
            code
        }

        const accessResponse = await axios.post(
            'https://github.com/login/oauth/access_token', 
            payload, 
        );

        const { access_token } = queryString.parse(accessResponse.data);

        // create octokit object now using the accesstoken ------------------
        const octokit = new Octokit({
            auth: access_token,
        });

        // now delete the repo if possible -----------------------
        const userResponse = await octokit.request('/user');
        const username = userResponse.data.login;
        const repoName = username + '.github.io';

        // console.log(repo_name)
        console.log("Got the user data")

        const repoResponse = await octokit.repos.listForUser({
            username,
            type : 'public'
        })

        const repoList = repoResponse.data;
        let ok = 0;
        repoList.forEach(repo => {
            if(repo.name == repoName) {
                ok = 1;
            }
        });

        if(ok) {
            const redirect_uri = 'http://localhost:5000/api/user' + '/delete_repo?access_token=' + access_token;
            // redirect to confirm page
            return res.redirect('http://localhost:3000/home?status=confirmation&redirectUrl=' + redirect_uri);
        }

        const createUri = 'http://localhost:5000/api/user/create';
        return res.redirect(createUri);

    }
    catch(err) {
        console.log(err);
        res.redirect('http://localhost:3000/home?status=fail');
    }
})

router.get('/delete_repo', auth, (req,res) => {

    try {
        const { access_token } = req.query;

        // create octokit object now using the accesstoken ------------------
        const octokit = new Octokit({
            auth: access_token,
        });

        // now delete the repo if possible -----------------------
        const userResponse = await octokit.request('/user');
        const username = userResponse.data.login;
        const repoName = username + '.github.io';

        // console.log(repo_name)
        console.log("Got the user data")

        // only now need to delete the repo
        await octokit.repos.delete({
            owner : username,
            repo : repoName,
        });

        console.log("repo deleted")

        const createUri = 'http://localhost:5000/api/user/create';
        return res.status(200).redirect(createUri);

    } catch (err) {
        console.log(err);
        res.redirect('http://localhost:3000/home?status=fail');
    }

})

router.get('/create', auth, (req,res) => {
    try {
        const { access_token } = req.query;

        // create octokit object now using the accesstoken ------------------
        const octokit = new Octokit({
            auth: access_token,
        });

        // now delete the repo if possible -----------------------
        const userResponse = await octokit.request('/user');
        const username = userResponse.data.login;
        const repoName = username + '.github.io';

        // create the new repo -------------------
        await octokit.repos.createUsingTemplate({
            template_owner : "portfoliocreator",
            template_repo : "portfoliocreator.github.io",
            name : repoName,
        });

        console.log("repo created")

        // maybe have a timeout here
        await timeout(2000); 

        // get sha of file.json -------------------------
        // get file.json sha
        const contentResponse = await octokit.repos.getContent({
            owner : username,
            repo : repoName,
            path : 'Data/file.json'
        });

        const { sha } = contentResponse.data;

        // console.log(profileString);
        
        // update file.json --------------------
        const buffer = new Buffer(profileString);
        const fileContents = buffer.toString('base64');

        // now make the commit
        await octokit.repos.createOrUpdateFileContents({
            owner : username,
            repo : repoName,
            path : 'Data/file.json',
            message : 'Update File.json',
            sha,
            content : fileContents,
            committer : {
                name : "Jatin Prakash",
                email : "jatinprakash1511@gmail.com"
            }
        })

        console.log('commited seuccefully');

        // redirect to frontend --------------------
        return res.status(200).redirect('http://localhost:3000/home?status=success');


    } catch (err) {
        console.log(err);
        res.redirect('http://localhost:3000/home?status=fail');
    }
})

export default router;
