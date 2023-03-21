import * as dotenv from 'dotenv';
dotenv.config();

import { Octokit, App } from 'octokit';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const {
    data: { login },
} = await octokit.rest.users.getAuthenticated();
console.log("Hello, %s", login);

await octokit.rest.issues.create({
    owner: "UnyteDAO",
    repo: "Unyte-Discord",
    title: "Hello world from" + login,
    body: "test! 🤛😤🤜",
});