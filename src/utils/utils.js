const axios = require('axios');
const unzip = require('unzip-stream');
const rimraf = require('rimraf');
require('dotenv').config();

const token = process.env.GITHUB_TOKEN;

async function downloadBranch(user, repo, branch) {
    return new Promise((resolve, reject) => {
        const url = `https://github.com/${user}/${repo}/archive/refs/heads/${branch}.zip`;
        axios.get(url, {
            responseType: "stream",
            headers: {
                'Authorization': `token ${token}`
            }
        }).then((response) => {
            resolve(response.data);
        })
        .catch(reject);
    });
}

async function extractZip(file, stream) {
    return new Promise((resolve, reject) => {
        stream.pipe(unzip.Extract({ path: file })).on('finish', () => {
            resolve();
        }).on('error', reject);
    });
}

async function rmdir(dir) {
    return new Promise((resolve, reject) => {
        rimraf(dir).then(() => {
            resolve();
        }).catch(err => {
            if (err) {
                console.error(chalk.red("\t" + err));
                reject();
            }
        });
    });
}

function isGitHubAvailable() {
    return token !== undefined;
}

module.exports = {
    extractZip,
    rmdir,
    downloadBranch,
    isGitHubAvailable
};
