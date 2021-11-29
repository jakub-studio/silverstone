const { scriptDebug, logDivider, scriptError, getArg, list } = require("./utils");
const nodeInspect = require("util").inspect;

const build = require("./cmds/build");
const startWeb = require("./cmds/start-web");

const command = process.argv[2].toLowerCase();
const args = require("minimist")(process.argv.splice(3));

scriptDebug("scripts init");
scriptDebug(`command: ${nodeInspect(command)}`);
scriptDebug(`args: ${nodeInspect(args)}`);
logDivider(true);

switch (command) {
	case "build":
		const envArg = getArg(args, "e", "environment", true);
		if (!envArg) return scriptError("No environment argument was provided for build command");
		const targetArg = getArg(args, "t", "target", true);
		if (!targetArg) return scriptError("No target argument was provided for build command");
		// const devServerArg = Boolean(getArg(args, "-d", "--dev-server"));

		scriptDebug("Build Command Arguments", list({
			"Environment": envArg,
			"Target": targetArg
		}));
		logDivider(true);

		build({
			env: envArg,
			target: targetArg
		});
		break;
	case "start-web":
		startWeb();
		break;
}