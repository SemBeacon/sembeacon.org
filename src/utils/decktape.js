import chalk from 'chalk';
import { spawn } from 'child_process';
import path from 'path';
import handler from 'serve-handler';
import crypto from 'crypto';
import http from 'http';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let queue = [];

export async function decktape(el) {
    el.addAsyncShortcode("decktape", async (title, page) => {
        const fileBuffer = fs.readFileSync(page.inputPath);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        const hex = hashSum.digest('hex');

        const url = `http://localhost:3000${page.url}?disablepointer`;
        queue.push({
            title,
            url: url + "&presenter",
            pdf: path.join(page.outputPath, `../${page.fileSlug}_presentation-16x9.pdf`),
            widescreen: true,
            hash: hex
        });

        fs.writeFileSync('_presentations.json', JSON.stringify(queue, null, 4), {
            encoding: 'utf-8'
        });
        return "";
    });
}

export async function generate() {
    queue = JSON.parse(fs.readFileSync('_presentations.json', {
        encoding: 'utf-8'
    }));
    const queue_old = fs.existsSync('_presentations_generated.json') ? JSON.parse(fs.readFileSync('_presentations_generated.json', {
        encoding: 'utf-8'
    })) : [];

    console.log(`There are ${queue.length} presentations to be generated ...`);
    console.log(`There are ${queue_old.length} presentations previously generated ...`);

    if (queue.length === 0) {
        return;
    }
    console.log(chalk.blue(`Starting web server for generating PDFs ...`));
    const server = await createServer(3000);
    for (let i = 0 ; i < queue.length ; i++) {
        const item = queue[i];
        const file = item.pdf ? item.pdf : item.images;
        const oldItems = queue_old.filter(i => i.title === item.title);
        if (!fs.existsSync(file) || (oldItems.length > 0 ? oldItems[0].hash !== item.hash : false)) {
            console.log(chalk.blue(`Generating ${item.pdf ? "PDF" : "screenshots"} for '${item.title}' ...`));
            console.log(chalk.yellow(`\tExists: ${fs.existsSync(file)}`));
            console.log(chalk.yellow(`\tHash mismatch: ${(oldItems.length > 0 ? oldItems[0].hash !== item.hash : false)}`));
            console.log(chalk.white(`\t${file}`));
            if (file === undefined){
                console.log(item);
            }
            await executeDecktape(item);   
        } else {
            console.log(chalk.yellow(`Skipping ${item.pdf ? "PDF" : "screenshots"} for '${item.title}'!`));
        }
    }
    console.log(chalk.blue(`Stopping web server for generating PDFs!`));
    server.close();
    fs.copyFileSync('_presentations.json', '_presentations_generated.json');
}

function createServer(port = 3000) {
    return new Promise((resolve) => {
        const server = http.createServer((request, response) => {
            return handler(request, response, {
                public: path.join(__dirname, '../../dist')
            });
        });

        server.listen(port, () => {
            resolve(server);
        });
    });
}

function executeDecktape(item) {
    return new Promise((resolve, reject) => {
        let process = undefined;

        if (item.images) {
            console.log(chalk.white(`\t${item.images}`));
            if (fs.existsSync(item.images)) {
                console.warn(chalk.yellow(`\tRemoving directory with screenshots ...`));
                fs.rmSync(item.images, { recursive: true, force: true });
            }
            fs.mkdirSync(item.images);
            process = spawn(
                path.join(__dirname, '../../node_modules/.bin/decktape'), 
                [
                    `--screenshots`,
                    `--screenshots-directory ${item.images}`,
                    `--size=2048x${item.widescreen ? 1152 : 1536}`, `"${item.url}"`, `${item.slug}.pdf`,
                ], {
                    shell: true
                });
        } else if (item.pdf) {
            if (fs.existsSync(item.pdf)) {
                fs.rmSync(item.pdf);
            }

            process = spawn(
                path.join(__dirname, '../../node_modules/.bin/decktape'), 
                [
                    `--size=2048x${item.widescreen ? 1152 : 1536}`, `"${item.url}"`, item.pdf,
                ], {
                    shell: true
                });
        } 

        process.on('error', (err) => {
            reject(err);
        });

        process.stdout.on('data', (data) => {
            console.log(chalk.blueBright(`${data}`));
        });
        
        process.on('close', (code) => {
            resolve();
        });
    });
}
