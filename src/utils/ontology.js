const chalk = require('chalk');
const { copySync } = require('fs-extra');
const { 
    isGitHubAvailable, 
    extractZip, 
    rmdir, 
    downloadBranch 
} = require("./utils");

async function buildDocs() {
    if (!isGitHubAvailable()) {
        console.log(chalk.redBright(`Github API is not available!`));
        return;
    }
    
    try {
        const stream = await download("specification");
        console.log(chalk.white(`\tExtracting documentation for specification`));
        await extractZip(`dist/terms/specification`, stream);
        copySync(`dist/terms/specification/specification-gh-pages`, `dist/terms/`, { overwrite: true });
        await rmdir(`dist/terms/specification`);
    } catch(ex) {
        console.error(chalk.red(`\tUnable to get documentation for specification`));
        console.error(ex);
    }
}

async function download(repo) {
    return new Promise((resolve, reject) => {
        console.log(chalk.green(`Downloading documentation for '${repo}'`));
        downloadBranch("SemBeacon", repo, 'gh-pages').then(resolve)
            .catch(reject);
    });
}

module.exports = buildDocs;
