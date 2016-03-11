APSIS CLI
=========

A set of handy tools for everyday development at Apsis.

# Installation
`npm install -g apsis-cli`

# Usage
Some tasks expects a configuration file to exist in `HOME/.apsis/config.json`. The current configuration keys are:

|Name|Description|
|---|---|
|slack.team|The Slack team to post notifications to.|
|slack.token|Slack token for incoming webhook.|
|slack.channel|The Slack channel to post notifications to.|
|imgflip.user|Imgflip user for generating memes.|
|imgflip.password|Imgflip password for generating memes.|

Once that is setup, run the tool with `$> apsis`. That will show you a menu of all available actions. You can also access actions directly by using their command. Eg. `$> apsis tfs`.

## Available actions:

|Name|Alias|Description|
|---|---|---|
|finish-branch|fb|Finish a feature or release branch in Git flow style.|
|tfs|-|Open the current repo in TFS.|
|pr|-|Open the current repo's PR page in TFS.|
