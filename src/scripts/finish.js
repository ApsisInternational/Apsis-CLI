const spawn = require('child_process').spawn;

const getUserHome = require('./utils.js').getUserHome;
const config = require(getUserHome() + '/.apsis/config.json');

module.exports = function finish() {
    if (!config) {
        throw new Error('Could not find you config file.');
    }
    if (!config.slack || !config.slack.team || !config.slack.token || !config.slack.channel) {
        throw new Error('It seems like your config is incomplete. $HOME/.apsis/config.json must contain team, token and channel for Slack.');
    }
    if (!config.imgflip || !config.imgflip.user || !config.imgflip.password) {
        throw new Error('It seems like your config is incomplete. $HOME/.apsis/config.json must contain user and password for Imgflip.');
    }

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
