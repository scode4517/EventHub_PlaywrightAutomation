#!/usr/bin/env node
/** @format */

import { spawnSync } from 'child_process';

const rawArg = process.argv[2];

const tags = rawArg.replaceAll(',', '|');
console.log(tags);

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const playwrightArgs = ['playwright', 'test'];

const runPlaywright = (grepTag) => {
	const args = [...playwrightArgs];

	if (grepTag) {
		args.push('--grep', `"${grepTag}"`);
	}

	return spawnSync(command, args, {
		stdio: 'inherit',
		shell: true,
	});
};

const testResult = runPlaywright(tags);

if (testResult.status !== 0) {
	process.exit(testResult.status ?? 1);
}

const reportResult = spawnSync(command, ['playwright', 'show-report'], {
	stdio: 'inherit',
	shell: true,
});

process.exit(reportResult.status ?? 0);
