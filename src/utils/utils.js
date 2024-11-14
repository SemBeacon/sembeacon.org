import axios from 'axios';
import unzip from 'unzip-stream';
import { rimraf } from 'rimraf';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.GITHUB_TOKEN;

export async function downloadBranch(user, repo, branch) {
    return new Promise((resolve, reject) => {
        const url = `https://api.github.com/repos/${user}/${repo}/zipball/${branch}`;
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

export async function extractZip(file, stream) {
    return new Promise((resolve, reject) => {
        stream.pipe(unzip.Extract({ path: file })).on('finish', () => {
            resolve();
        }).on('error', reject);
    });
}

export async function rmdir(dir) {
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

export function isGitHubAvailable() {
    return token !== undefined;
}
