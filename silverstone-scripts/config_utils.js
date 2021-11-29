const { resolve } = require("path");
const { installedElectronVersion } = require("./__internal__/utils");


/**
 * Resolve a path with `process.cwd()` as the base path.
 * @param  {...string} pathSegments 
 * @returns {string}
 */
module.exports.resolveToCwd = (...pathSegments) => {
	return resolve(process.cwd(), ...pathSegments)
}

/**
 * @private
 * @returns {string} e.g. "13.2"
 */

const _electronVersionMajorMin = () => {
	try {
		const split = installedElectronVersion.split(".");
		const major = split[0];
		const minor = split[1];

		// Check if major and minor strings are valid numbers
		// TODO use parseInt(number, 10)
		if (!isNaN(major) && !isNaN(minor)) {
			return `${major}.${minor}`;
		} else return "";
	} catch {
		return "";
	}
}

/**
 * Gets the webpack target string for electron contexts. 
 * [Webpack Documentation](https://webpack.js.org/configuration/target/#string)
 * @param {"main"|"preload"|"renderer"} type 
 * @returns {string}
 */
module.exports.getElectronTarget = type => {
	return `electron${_electronVersionMajorMin()}-${type}`
}

/**
 * Get template parameters to be used by `HtmlWebpackPlugin`.
 * @param {object} vars 
 * @param {Record<string,string>=} additionalParameters Additional paramters to merge into the returned object.
 * @returns {Record<string,string>}
 */
module.exports.getHTMLTemplateParameters = (vars) => {
	return Object.assign({
		reactRootId: vars.reactRootId,
		contentSecurityPolicy: vars.env === "development" ? vars.csp.development : vars.csp.production
	}, vars.htmlTemplateParamters)
}

/**
 * Re-export of `JSON.stringify`. Mainly used for wrapping strings with quotes (`""`) for
 * webpack's `DefinePlugin`.
 */
module.exports.s = JSON.stringify;