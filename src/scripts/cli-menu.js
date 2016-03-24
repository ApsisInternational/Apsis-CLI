const Menu = require('terminal-menu');

const commands = [
    { text: 'FINISH THIS BRANCH (fb)', cmd: 'fb' },
    { text: 'OPEN TFS URL (tfs)', cmd: 'tfs' },
    { text: 'OPEN TFS PR URL (pr)', cmd: 'pr' },
    { text: 'CHECK VERSION OF PACKAGE (wv)', cmd: 'wv' },
    { text: 'CREATE NEW RELEASE (cr)', cmd: 'cr' },
];

module.exports = function cliMenu() {
    const utils = require('./utils.js');
    const runCommand = require('./run-command.js');

    var menu = Menu({ width: 29, x: 4, y: 2 });

    menu.reset();
    menu.write('APSIS CLI\n');
    menu.write('-------------------------\n');

    commands.forEach((command, index) => {
        menu.add(`${index + 1}. ${command.text}`);
    })
    menu.write('-------------------------\n');
    menu.add('> EXIT');

    menu.on('select', function (label, index) {
        menu.close();

        if (index < commands.length) {
            runCommand(commands[index].cmd);
        }
    });

    process.stdin.pipe(menu.createStream()).pipe(process.stdout);

    process.stdin.setRawMode(true);
    menu.on('close', function () {
        process.stdin.setRawMode(false);
        process.stdin.end();
    });
}
