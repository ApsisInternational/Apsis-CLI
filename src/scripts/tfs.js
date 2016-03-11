const git = require('git-promise');
const open = require('open');

module.exports = function openTfs(openPr = false) {
    git('git remote -v')
        .then(function (remote) {
            const remoteUrl = remote.match(/http[^\s]+/)[0];

            if (remoteUrl && remoteUrl.length) {
                if (openPr) {
                    open(remoteUrl + '/pullrequests');
                } else {
                    open(remoteUrl);
                }
            } else {
                console.log('Could not find a remote url for this repo.');
            }
        })
        .catch(e => {
            console.log('Something went wrong when trying to read the Git remote. Are you sure you are in the right directory?');
        });
}
