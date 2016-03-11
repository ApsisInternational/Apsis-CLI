const spawn = require('child_process').spawn;

const getUserHome = require('./utils.js').getUserHome;
const config = require(getUserHome() + '/.apsis/config.json');

module.exports = function finish() {
    var ls = spawn('sh', [
        __dirname + '/bash/finish.sh',
        config.slack.team,
        config.slack.token,
        config.slack.channel,
        config.imgflip.user,
        config.imgflip.password
    ]);

    ls.stdout.on('data', function (data) {
        console.log('' + data);
    });

    ls.stderr.on('data', function (data) {
        console.log('Error: ' + data);
    });
}
