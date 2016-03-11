const spawn = require('child_process').spawn;

const getUserHome = require('./utils.js').getUserHome;
const config = require(getUserHome() + '/.apsis/config.json');

module.exports = function finish() {
    const ls = spawn('sh', [
        __dirname + '/bash/finish.sh',
        config.slack.team,
        config.slack.token,
        config.slack.channel,
        config.imgflip.user,
        config.imgflip.password
    ]);

    ls.stdout.on('data', output);
    ls.stderr.on('data', output);

    function output(data) {
        const output = data.toString();

        if (output.length > 0) {
            console.log(output.trim());
        }
    }
}
