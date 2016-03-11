const finish = require('./finish.js');
const tfs = require('./tfs.js');
const menu = require('./cli-menu.js');

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
        default:
            menu();
            break;
    }
}
