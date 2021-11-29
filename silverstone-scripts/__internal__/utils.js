const path = require("path");
const { inspect } = require("util");

/** Paths related to silverstone */
module.exports.paths = {
	/** The `silverstone-scripts` folder */
	silverstone: path.join(__dirname, ".."),
	/** The `silverstone-scripts/__internal__` folder */
	internal: __dirname
}

module.exports.debugName = ["-l", "--log-debug"];

/**
Whether debug logging is enabled. Enabled by passing `-l` or `--log-debug` arguments when executing a command.
*/
module.exports.debug = process.argv.some(e => module.exports.debugName.includes(e));

/**  The semver string of the currently installed electron version. */
module.exports.installedElectronVersion = require("../../node_modules/electron/package.json").version;
/* ^^ Accessing it from electron's package.json is most likely the fastest way as the other
two options are access from project's package json but that requires cleaning of version chars (^, @, etc)
or require package-lock but that will slow the program down significantly due to the large amount of data
that the package-lock holds.
Do not place this commennt in the jsdoc tag as this is just reasoning for future code reviews.
*/

/**
 * Object For Each Callback Definition
 * @callback objectForEachCallback
 * @param {string} key - Key of the current property.
 * @param {any} value - Value of the current property.
 * @param {object} this - The object being looped.
 */

/** forEach but for objects.
 * @param {object} object - The object to be looped.
 * @param {objectForEachCallback} callback - The callback to be executed.
 * @example
 * objectForEach({hello: "Hi!"}, (key, value, this) => console.log(key + " -> " + value))
 * // [console] hello -> Hi!
*/ 
module.exports.objectForEach = (object, callback) => {
	Object.keys(object).forEach(key => {
		callback(key, object[key], object);
	});
}

/**  Accepts either a `string` or `string[]` and returns string[] always
 * @param {string|string[]} arg - the string or string array to be processed.
 * @returns {string[]} If a `string` was passed, an `string[]` containing only that string is returned. If a `string[]` was passed, that array is returned without changes.
 * @example
 * handleStringArrayArg("hello") -> ["hello"]
 * @example
 * handleStringArrayArg(["hello", "123"]) -> ["hello", "123"]
*/
module.exports.handleStringArrayArg = arg => {
	if (typeof arg === "string") return [arg];
	if (Array.isArray(arg)) return arg;

	else return [];
}

// ___POTENTIALLY REMOVE AS UNUSED___
// Essentially lodash#get but only accepts dots (.) as member expressions, [] syntax is unsupported.
// e.g. getValueWithPath({hello: {hi: true}}, "hello.hi") -> true
module.exports.getValueWithPath = (object, path) => {
	const split = path.split(".");

	if (split.length === 0) {
		// No object traversal required.
		return object[split[0]]
	} else {
		// Object traversal required.
		let current = object;
		for (const [index, key] of split.entries()) {
			const isLastKey = index === (split.length - 1);

			if (isLastKey) {
				return current[key];
			} else {
				const hasProp = current.hasOwnProperty(key);
				if (hasProp && typeof current[key] === "object") {
					current = current[key];
					continue;
				} else return undefined; // undefined is kept here for better readability even though return; does the same.
			}
		}
	}
}

// Helper function that works on the return value of minimist (requested as argument 0 [args]).
// shortName and longName are the keys to try and find since command arguments typically have a
// short (e.g. -i) and long (e.g. --information) variant. For those examples: shortName = "i", longName = "information"
// mustBeString is an optional arg that will make the fn return null if the argument is declared as a boolean
// e.g. (-i "hello" OR -i hello) is a string argument and (-i) is just a boolean argument
module.exports.getArgument = (args, shortName, longName, mustBeString) => {
	if (args[shortName]) {
		let item = args[shortName];
		if (typeof item !== "string" && mustBeString) return null;
		else return args[shortName];
	}
	else if (args[longName]) {
		const item = args[longName];
		if (typeof item !== "string" && mustBeString) return null;
		else return args[longName];
	}
}

/**
 * @todo jsdoc
 * @param {any} value Value to inspect
 * @param {boolean=} viewHidden Display hidden properties such as `array.length`
 * @param {number=} depth How deep to inspect the value, increase if using objects with many nested properties.
 * @returns {string}
 */
module.exports.inspect = (value, viewHidden, depth) => {
	return inspect(value, viewHidden || false, depth || 5, true);
}

/**
 * Type checking utility funciton. When argument `type` is a string, a `typeof` check is performed on `value`.
 * If the `type` argument is a function, an `instanceof` check is performed on `value`.
 * @param {any} value 
 * @param {"bigint"|"function"|"boolean"|"number"|"string"|"object"|"symbol"|"undefined"|function} type 
 * @returns {boolean}
 */

module.exports.is = (value, type) => {
	if (typeof type === "string") {
		return typeof value === type;
	} else return value instanceof type;
}

/**
 * @todo JSDOC
 * @param {number} num 
 * @param {string=} pluralEnding 
 * @returns {string}
 */
module.exports.plural = (num, pluralEnding) => {
	if (num >= 2) return pluralEnding || "s";
	else return "";
}

/**
 * 
 * @param {any[]} array 
 * @param {number} currentIndex 
 * @returns {number}
 */

module.exports.getNextArrayIndex = (array, currentIndex) => {
	const lastElementIndex = array.length - 1;
	if (currentIndex >= lastElementIndex) return 0;
	else return currentIndex + 1;
}