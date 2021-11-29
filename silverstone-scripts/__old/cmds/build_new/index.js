const { fork } = require("child_process");
const { join } = require("path");
const shared = require("./shared");

const childPath = join(__dirname, "child.js")

const spawnProcess = opts => {
	const child = fork(childPath, [], {stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ], env: {
		[shared.targetEnvName]: opts.target,
		[shared.envEnvName]: opts.env
	}});

	return child;
}

module.exports = opts => {

}