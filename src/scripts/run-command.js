const finish = require('./finish.js');
const tfs = require('./tfs.js');
const menu = require('./cli-menu.js');
const config = require('./config.js');
const whatVersion = require('@hmps/what-version');
const createRelease = require('@hmps/create-release');

module.exports = function runCommand(cmd) {
    switch(cmd) {
        case 'fb':
        case 'finish-branch':
            finish();
            break;
        case 'tfs':
            tfs();
            break;
        case 'pr':
            tfs(true);
            break;
        case 'config':
            config();
            break;
        case 'wv':
            whatVersion();
            break;
        case 'cr':
            createRelease();
            break;
        default:
            menu();
            break;
    }
}
