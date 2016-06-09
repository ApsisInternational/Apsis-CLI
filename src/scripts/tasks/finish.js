const git = require('git-promise');

const spawn = require('child_process').spawn;
const postToSlack = require('./slack.js');

module.exports = finish;

function finish() {
    const ls = spawn('sh', [
        __dirname + '/../bash/finish.sh'
    ]);

    ls.stdout.on('data', output);
    ls.stderr.on('data', output);
    ls.on('close', (exitCode) => {

        if (exitCode === 0) {
            git("rev-parse --abbrev-ref HEAD").then(function (branch) {
                if (branch.indexOf('release/')) {
                    const pkg = require(`${process.cwd()}/package.json`);
                    postToSlack(pkg.name, pkg.version, '#usingfrontend');
                }
            });
        }
    })

    function output(data) {
        const output = data.toString();

        if (output.length > 0) {
            console.log(output.trim());
        }
    }
}
