const { configJSON } = require("./");
const { log } = require("../cli");

/**
 * 
 * @param {string} str Identifier to be checked if it's legal.
 * @returns {boolean}
 */
const identifierIsLegal = str => {
	if (typeof str !== "string") return false;
	if (str.trim() === "") return false;
	if (str === "*") return false;
	if (str.startsWith("opts")) return false;
	if (str.indexOf(",") !== -1) return false;
	return true;
}

const verifyConfig = () => {
	if (configJSON.variables.env) {
		// In non env configs (targets), the env variable is automatically set based on the env
		// argument that is passed in the build command. Hence, it cannot be manually specified.
		return log.error("Illegal variable in config", "The property 'env' cannot be present in the variables object in config as it's a reserved property.")
	}
}