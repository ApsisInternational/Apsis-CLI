const finish = require('./finish.js');
const tfs = require('./tfs.js');
const menu = require('./cli-menu.js');
const config = require('./config.js');
const whatVersion = require('@hmps/what-version');
const createRelease = require('@hmps/create-release');

module.exports = function runCommand(cmd) {
    switch(cmd) {
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
        default:
            menu();
            break;
    }
}
