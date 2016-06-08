const fs = require('fs');

module.exports = getChangelogObject;

function getChangelogObject(component) {
    return new Promise((resolve, reject) => {
        fs.readFile(`${process.cwd()}/CHANGELOG.md`, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }

            resolve(parseChangelog(component, data));
        });
    });

    function parseChangelog(component, changelogData) {
        const changelog = {};
        changelog.component = component;
        const versions = changelogData.match(/#+\s\[[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}\]/g);

        if (versions[0] && versions[1]) {
            changelog.text = changelogData.substr(0, changelogData.indexOf(versions[1]) - 1).trim();
        } else {
            changelog.text = changelogData;
        }

        const headings = {
            bugs: '### bug fixes',
            features: '### features',
            breaking: '### breaking changes',
        };

        const positions = {
            bugs: changelog.text.toLowerCase().indexOf(headings.bugs),
            features: changelog.text.toLowerCase().indexOf(headings.features),
            breaking: changelog.text.toLowerCase().indexOf(headings.breaking),
        };

        changelog.version = versions[0].match(/([0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2})/)[0];
        changelog.bugs = [];
        changelog.features = [];
        changelog.breaking = [];

        function getNextSection(text, index, marker) {
            const nextSectionIndex = text.substr(index).indexOf('#');

            if ( nextSectionIndex > -1) {
                return nextSectionIndex;
            }

            return undefined;
        }

        if (positions.bugs > -1) {
            changelog.bugs = changelog.text.substr(
                positions.bugs + headings.bugs.length,
                getNextSection(changelog.text, positions.bugs + headings.bugs.length, '#')
            )
            .trim()
            .split('*')
            .filter(item => item.length > 0)
            .map(item => {
                return '* ' + item.substr(0, item.indexOf('([')).trim();
            });
        }

        if (positions.features > -1) {
            changelog.features = changelog.text.substr(
                positions.features + headings.features.length,
                getNextSection(changelog.text, positions.features + headings.features.length, '#')
            ).trim().split('*').filter(item => item.length > 0)
            .map(item => {
                return '* ' + item.substr(0, item.indexOf('([')).trim();
            });
        }

        if (positions.breaking > -1) {
            changelog.breaking = changelog.text.substr(
                positions.breaking + headings.breaking.length,
                getNextSection(changelog.text, positions.breaking + headings.breaking.length, '#')
            ).trim().split('*').filter(item => item.length > 0)
            .map(item => {
                return '* ' + item.trim();
            });
        }

        return changelog;
    }
}
