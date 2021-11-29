/**
 * @file CLI related functions. Any logging should be mainly done through these.
 */

const chalk = require("chalk");
const { debug } = require("../utils");
const pkg = require("../package.json");

/** Highlights the provided text in bright blue. Denoting important data or information.
 * @param {string} text String to highlight.
 * @returns {string}
 */
module.exports.highlight = text => chalk.blueBright(text);

/** Highlights the provided text in bright green. Denoting a successful operation.
 * @param {string} text String to highlight.
 * @returns {string}
 */
module.exports.success = text => chalk.greenBright(text);

/** Formats an object to a prettified and colourised string.
 * @param {object} obj Object to format.
 * @param {boolean=} colour Apply colour (highlight / light blue) to values. Defaults to `true`
 * @returns {string} Prettified object.
 * @example
 * console.log(
 * 	cli.list({"System Status": "OK"})
 * )
 * // System Status: OK
 */
module.exports.list = (obj, colour = true) => Object.keys(obj).map(k => `${k}: ${colour ? module.exports.highlight(obj[k]) : obj[k]}`).join("\n");

/** Base logging function. Acts a base for functions featured in `module.exports.log`
 * @param {string} type Type of messaged to be logged.
 * @param {function} colouriseFn Colour method that will be applied to prefix (name + type). Usually an export of `chalk`.
 * @param {string} title Text will that appear on the first line after the prefix.
 * @param {string?} desc Optional text that will appear on the following lines.
 * @param {boolean=} err If `true`, `console.error` will be used instead of `console.log`
*/
const log = (type, colouriseFn, title, desc, err) => {
	console[err ? "error" : "log"](`${colouriseFn(`${pkg.name} ${type}`)} ${title}${desc ? "\n" + desc : ""}`)
}

/** Logging functions for silverstone
 * @mixin
 */
module.exports.log = {
	_raw: log,
	/** String that is used for dividers.
	 * @readonly
	 * @constant
	 */
	_dividerString: Array(25).join("-"),
	/**
	 * Log an error.
	 * @param {string} title Title of the error.
	 * @param {string=} desc Description of the error, such as a stack. 
	 */
	error(title, desc) {
		log("error", chalk.redBright, title, desc);
	},
	/**
	 * Log a warning.
	 * @param {string} title Title of the warning.
	 * @param {string=} desc Description of the warning.
	 */
	warning(title, desc) {
		log("warning", chalk.yellowBright, title, desc);
	},
	/**
	 * Log a debug message that is only visible when debug mode is enabled. See `silverstone-scripts/__internal__/utils.js`
	 * for the `debug` export that determines whether this is visible.
	 * @param {string} title Title of the debug message.
	 * @param {string=} desc Description of the debug message.
	 */
	debug(title, desc) {
		if (!debug) return;
		log("debug", chalk.blue, title, desc)
	},
	/**
	 * Log a divider.
	 */
	divider() {
		console.log(this._dividerString);
	},
	/**
	 * Log a divider that is only visible when debug mode is enabled.
	 */
	debugDivider() {
		this.debug(this._dividerString)
	}
}

// Based on https://github.com/nathanpeck/clui/blob/master/lib/clui.js#L350

/**
 * 
 * @param {boolean=} clearScreen
 * @returns {void}
 */
module.exports.clear = clearScreen => {
	if (clearScreen === true) {
		// Ansi code for clearing screen
		process.stdout.write('\x1b[2J');
	}
	// if false, don't clear screen, rather move cursor to top left
	process.stdout.write('\033[0;0f');
}

//https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json#L571
module.exports.loadingDots = {
	refreshRate: 400,
	frames: []
}