const chalk = require("chalk");
const pkg = require("../package.json");

const electronTargets = ["main", "renderer", "preload"];
const fileExts = ["ts", "js"].map(e => `.${e}`);
const fileExtsJsx = fileExts.map(e => e + "x");

const scriptLog = (type, colouriseFn, title, desc) => {
	console.log(`${colouriseFn(`silverstone ${type}`)} ${title}${desc ? "\n" + desc : ""}`)
}
const divider = "-----------------";
const debugLoggingEnabled = process.argv.includes("-l") || process.argv.includes("--log-debug");

module.exports = {
	// process can be 'main', 'renderer', or 'preload'
	// https://webpack.js.org/configuration/target/
	getElectronTarget (_process) {
		if (_process && (!electronTargets.includes(_process.toLowerCase())))  {
			exports.scriptError("invalid electron target", "arguments[0] (process) given to scriptutils#getElectronTarget was invalid. Must be " + electronTargets.map(e => JSON.stringify(e)).join(" or "));
			process.exit();
			return;
		}
		const process = _process ? _process.toLowerCase() : "renderer";
		const split = pkg.dependencies.electron.replace(/\^/g, "").split(".");
		return `electron${split[0]}.${split[1]}-${process}`;
	},
	getArg (args, shortname, longname, mustBeString) {
		if (args[shortname]) {
			let item = args[shortname];
			if (typeof item !== "string" && mustBeString) return null;
			else return args[shortname];
		}
		else if (args[longname]) {
			const item = args[longname];
			if (typeof item !== "string" && mustBeString) return null;
			else return args[longname];
		}
	},
	defineAliases (obj, aliases) {
		aliases.forEach(alias => {
			alias.names.forEach(n => {
				Object.defineProperty(obj, n, {
					get: alias.get,
					enumerable: true
				})
			})
		})
	},
	list (obj) {
		return Object.keys(obj).map(k => `${k}: ${module.exports.highlight(obj[k])}`).join("\n");
	},
	highlight (text) {
		return chalk.blueBright(text);
	},
	success (text) {
		return chalk.greenBright(text);
	},
	scriptError(title, desc) {
		scriptLog("error", chalk.redBright, title, desc);
	},
	scriptWarning (title, desc) {
		scriptLog("warning", chalk.yellowBright, title, desc);
	},
	scriptDebug (title, desc) {
		if (debugLoggingEnabled) {
			scriptLog("debug", chalk.blue, title, desc)
		}
	},
	logDivider (debugOnly) {
		if (!debugOnly) {
			console.log(divider);
		} else if (debugOnly && debugLoggingEnabled) {
			console.log(divider);
		}
	},
	electronTargets,
	fileExts,
	fileExtsJsx,
	debugLoggingEnabled,
	_scriptLog: scriptLog
}