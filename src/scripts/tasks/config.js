const fs = require('fs');
const prompt = require('prompt');

const getUserHome = require('../utils.js').getUserHome;
const userConfig = require(getUserHome() + '/.apsis/config.json');

module.exports = function config() {
    const _config = userConfig || {};

    console.log('Configure Apsis CLI.');

    prompt.message = '';
    prompt.start();

    prompt.get({
        properties: {
            slackTeam: {
                description: 'What is the name of your Slack team?',
            },
            slackChannel: {
                description: 'What is the name of your Slack channel?',
            },
            slackToken: {
                description: 'What is your Slack token?',
            },
            imgflipUser: {
                description: 'What is your imgflip username?',
            },
            imgflipPass: {
                description: 'What is your imgflip password?',
            },
        },
    }, function (err, result) {
        _config.slack = _config.slack || {};
        _config.imgflip = _config.imgflip || {};

        _config.slack.team = result.slackTeam;
        _config.slack.channel = result.slackChannel;
        _config.slack.token = result.slackToken;

        _config.imgflip.user = result.imgflipUser;
        _config.imgflip.password = result.imgflipPass;

        fs.writeFile(getUserHome() + '/.apsis/config.json', JSON.stringify(_config, null, 4), (err) => {
            if (err) throw err;
            console.log('Your configuration has been saved!');
        });
  });

}
