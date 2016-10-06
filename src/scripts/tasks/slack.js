'use strict';

var request = require('request');
var getChangelogObject = require('./parse-changelog');

var prodUrl = 'https://hooks.slack.com/services/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';
var testUrl = 'https://hooks.slack.com/services/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';

module.exports = postToSlack;

function postToSlack(component, version, isTest) {
    var changelog = getChangelogObject({ name: component, version: version }).then(function (response) {
        sendMessageToSlack(response, isTest);
    });
}

function sendMessageToSlack(changelog, isTest) {
    var attachments = [];

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

    console.log('Posting message to Slack.');

    request.post({
        url: isTest ? testUrl : prodUrl,
        body: JSON.stringify({
            "username": "Foxtrot ReleaseBot",
            "text": '*Greetings humans! Apsis component ' + changelog.component.name + '@' + changelog.component.version + '​ was just published.* :rocknroll::rocket::tada: \n These are the changes in this release:',
            "attachments": attachments,
            "icon_emoji": ":tada:"
        }),
        headers: {
            "cache-control": "no-cache"
        }
    });
}
