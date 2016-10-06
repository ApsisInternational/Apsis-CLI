'use strict';

var finish = require('./tasks/finish.js');
var tfs = require('./tasks/tfs.js');
var menu = require('./tasks/cli-menu.js');
var config = require('./tasks/config.js');
var postToSlack = require('./tasks/slack.js');
var whatVersion = require('@hmps/what-version');
var createRelease = require('@hmps/create-release');

module.exports = function runCommand(cmd) {
    switch (cmd) {
        case 'finish-branch':
        case 'fb':
            finish();
            break;
        case 'tfs':
            tfs();
            break;
        case 'pull-request':
        case 'pr':
            tfs(true);
            break;
        case 'config':
            config();
            break;
        case 'what-version':
        case 'wv':
            whatVersion();
            break;
        case 'create-release':
        case 'cr':
            createRelease();
            break;
        case 'post-changelog':
            var pkg = require(process.cwd() + '/package.json');
            postToSlack(pkg.name, pkg.version);
            break;
        default:
            menu();
            break;
    }
};
