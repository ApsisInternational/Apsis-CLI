'use strict';

var git = require('git-promise');

var spawn = require('child_process').spawn;
var postToSlack = require('./slack.js');

module.exports = finish;

function finish() {
    var ls;
    var releaseBranch = false;

    git("rev-parse --abbrev-ref HEAD").then(function (branch) {
        console.log('Branch name: ', branch);
        console.log('Indexof release/', branch.indexOf('release/'));

        if (branch.indexOf('release/') !== -1) {
            releaseBranch = true;
        }

        ls = spawn('sh', [__dirname + '/../bash/finish.sh']);

        ls.stdout.on('data', output);
        ls.stderr.on('data', output);
        ls.on('close', function (exitCode) {
            if (exitCode === 0 && releaseBranch) {
                var pkg = require(process.cwd() + '/package.json');
                postToSlack(pkg.name, pkg.version);
            }
        });
    });


    function output(data) {
        var output = data.toString();

        if (output.length > 0) {
            console.log(output.trim());
        }
    }
}
