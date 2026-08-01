#!/usr/bin/env node
/** @format */

const { spawnSync } = require('child_process');

const tagArg = process.argv[2];
const tag = tagArg ? (tagArg.startsWith('@') ? tagArg : `@${tagArg}`) : null;

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const playwrightArgs = ['playwright', 'test'];

if (tag) {
	playwrightArgs.push('--grep', tag);
}

const testResult = spawnSync(command, playwrightArgs, {
	stdio: 'inherit',
	shell: true,
});

if (testResult.status !== 0) {
	process.exit(testResult.status ?? 1);
}

const reportResult = spawnSync(command, ['playwright', 'show-report'], {
	stdio: 'inherit',
	shell: true,
});

process.exit(reportResult.status ?? 0);
