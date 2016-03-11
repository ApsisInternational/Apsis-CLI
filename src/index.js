#!/usr/bin/env node
const args = process.argv.slice(2)

const runCommand = require('./scripts/run-command.js');
const menu = require('./scripts/cli-menu.js');
const cmd = args[0];

runCommand(cmd);
