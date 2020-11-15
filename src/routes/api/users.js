// TODO fix return problems
/* eslint-disable consistent-return */
/* eslint-disable no-buffer-constructor */

import express from 'express';
import { Octokit } from '@octokit/rest';
import queryString from 'query-string';
import auth from '../../middleware/auth';
import axios from '../../utils/axios';
import {
    getProfile,
    timeout,
    getBackBaseUrl,
    getFrontBaseUrl,
    getTemplateUrl,
} from '../../utils/utils';

const router = express.Router();

// find all users, also to check if someone logged in or not
router.get('/', auth, (req, res) => {
    return res.json(req.user);
});

// route that hits the callback from github oauth
// for now only signed in users can do this
router.get('/github_deploy', auth, async (req, res) => {
    console.log(req.query);
    const { code, template } = req.query;
    // const { code } = req.query;
    console.log(`template is ${template}`);

    try {
        // now try to get the access token first -------------------------
        // https://github.com/login/oauth/access_token

        const payload = {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
        };

        console.log(payload);

        const accessResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            payload
        );

        const { access_token } = queryString.parse(accessResponse.data);

        // create octokit object now using the accesstoken ------------------
        const octokit = new Octokit({
            auth: access_token,
        });

        // now delete the repo if possible -----------------------
        const userResponse = await octokit.request('/user');
        const username = userResponse.data.login;
        const repoName = `${username}.github.io`;

        // console.log(repo_name)
        console.log('Got the user data');

        const repoResponse = await octokit.repos.listForUser({
            username,
            type: 'public',
        });

        const repoList = repoResponse.data;
        let isThereARepo = false;
        repoList.forEach((repo) => {
            if (repo.name === repoName) {
                isThereARepo = true;
            }
        });

        if (isThereARepo) {
            const redirect_uri = `${getBackBaseUrl()}/api/user/delete_repo?access_token=${access_token}&template=${template}`;
            // redirect to confirm page
            return res.redirect(
                `${getFrontBaseUrl()}/home?status=confirmation&redirectUrl=${redirect_uri}`
            );
        }

        const createUri = `${getBackBaseUrl()}/api/user/create?access_token=${access_token}`;
        return res.redirect(createUri);
    } catch (err) {
        console.log(err);
        res.redirect(`${getFrontBaseUrl()}/home?status=error`);
    }
});

router.get('/delete_repo', auth, async (req, res) => {
    try {
        const { access_token, template } = req.query;

        // create octokit object now using the accesstoken ------------------
        const octokit = new Octokit({
            auth: access_token,
        });

        // now delete the repo if possible -----------------------
        const userResponse = await octokit.request('/user');
        const username = userResponse.data.login;
        const repoName = `${username}.github.io`;

        // console.log(repo_name)
        console.log('Got the user data');

        // only now need to delete the repo
        await octokit.repos.delete({
            owner: username,
            repo: repoName,
        });

        console.log('repo deleted');

        const createUri = `${getBackBaseUrl()}/api/user/create?access_token=${access_token}&template=${template}`;
        return res.status(200).redirect(createUri);
    } catch (err) {
        console.log(err);
        res.redirect(`${getFrontBaseUrl()}/home?status=error`);
    }
});

router.get('/create', auth, async (req, res) => {
    const { access_token, template } = req.query;

    try {
        // get user data first
        // get the userdata
        const profileResponse = await getProfile(res, req.user.id);
        const profileCorrect = {
            profile: profileResponse,
        };

        const profileString = JSON.stringify(profileCorrect);
        // const profileString = 'hello';

        // create octokit object now using the accesstoken ------------------
        const octokit = new Octokit({
            auth: access_token,
        });

        // now delete the repo if possible -----------------------
        const userResponse = await octokit.request('/user');
        const username = userResponse.data.login;
        const repoName = `${username}.github.io`;

        // create the new repo -------------------
        await octokit.repos.createUsingTemplate({
            template_owner: 'portfoliocreator',
            template_repo: getTemplateUrl(template),
            name: repoName,
        });

        console.log('repo created');

        // NOTE : This is kind of a hack only, maybe a better method ??
        // maybe have a timeout here
        await timeout(4000);

        // get sha of file.json -------------------------
        // get file.json sha
        const contentResponse = await octokit.repos.getContent({
            owner: username,
            repo: repoName,
            path: 'Data/file.json',
        });

        const { sha } = contentResponse.data;

        // console.log(profileString);
        console.log(sha);

        // update file.json --------------------
        const buffer = new Buffer(profileString);
        const fileContents = buffer.toString('base64');

        // now make the commit
        await octokit.repos.createOrUpdateFileContents({
            owner: username,
            repo: repoName,
            path: 'Data/file.json',
            message: 'Update File.json',
            sha,
            content: fileContents,
            // TODO : Decide this ??
            committer: {
                name: 'portfoliocreator',
                email: 'portfoliocreatoriitd@gmail.com',
            },
        });

        console.log('commited successfully');

        // redirect to frontend --------------------
        return res
            .status(200)
            .redirect(`${getFrontBaseUrl()}/home?status=success`);
    } catch (err) {
        console.log(err);
        res.redirect(`${getFrontBaseUrl()}/home?status=error`);
    }
});

export default router;
