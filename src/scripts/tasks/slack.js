const request = require('request');
const getChangelogObject = require('./parse-changelog');

const prodUrl = 'https://hooks.slack.com/services/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';
const testUrl = 'https://hooks.slack.com/services/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';

module.exports = postToSlack;

function postToSlack(component, version, channel) {
    const changelog = getChangelogObject({name: component, version})
        .then(response => {
            sendMessageToSlack(response, channel);
        });
}


function sendMessageToSlack(changelog, channel) {
    const attachments = [];

    if (changelog.bugs.length) {
        attachments.push({
            "color": "#36a64f",
            "title": "Bug Fixes",
            "text": changelog.bugs.join('\n')
        });
    }

    if (changelog.features.length) {
        attachments.push({
            "color": "#6eafbd",
            "title": "Features",
            "text": changelog.features.join('\n')
        });
    }

    if (changelog.breaking.length) {
        attachments.push({
            "color": "#e08283",
            "title": "Breaking changes",
            "text": changelog.breaking.join('\n')
        });
    }

    console.log('Posting message to #usingfrontend.');

    request.post({
        url: prodUrl,
        body: JSON.stringify({
            "username": "Foxtrot ReleaseBot",
            "text": `*Greetings humans! Apsis component ${changelog.component.name}@${changelog.component.version}​ was just published.* :rocknroll::rocket::tada: \n These are the changes in this release:`,
            "attachments": attachments,
            "icon_emoji": ":tada:"
        }),
        headers: {
            "cache-control": "no-cache",
        },
    });
}
