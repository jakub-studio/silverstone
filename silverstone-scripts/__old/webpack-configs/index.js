const { merge } = require("webpack-merge");
const { scriptDebug, highlight, defineAliases, scriptError } = require("../utils");

const baseConfig = require("./base.config");
const electronBaseConfig = require("./target/electron_base.config");
const envConfigs = {
	development: require("./env/development.config"),
	production: require("./env/production.config"),
}
defineAliases(envConfigs, [
	{ names: ["dev", "d"], get () { return this.development }},
	{ names: ["prod", "p"], get () { return this.production }}
]);

const targetConfigs = {
	["electron-main"]: merge(electronBaseConfig, require("./target/electron_main.config")),
	["electron-renderer"]: merge(electronBaseConfig, require("./target/electron_renderer.config")),
	["electron-preload"]: merge(electronBaseConfig, require("./target/electron_preload.config")),
	web: require("./target/web.config"),
}
defineAliases(targetConfigs, [
	{ names: ["e-m", "e-main"], get () { return this["electron-main"] }},
	{ names: ["e-r", "e-renderer"], get () { return this["electron-renderer"] }},
	{ names: ["e-p", "e-preload"], get () { return this["electron-preload"] }},
	{ names: ["w"], get () { return this.web }},
]);

const _getConfig = (obj, objName, property) => {
	if (!obj) return scriptError("No object (arg 0) was provided to getPreset");
	if (obj[property]) {
		scriptDebug(`${objName} config: ${highlight(obj[property].name)}`);
		return obj[property]
	} else {
		scriptError(`'${highlight(property)}' ${objName} config doesn't exist`, `Available configs: ${Object.keys(obj).map(highlight).join(", ")}`);
		process.exit(1);
	}
}

exports.getConfig = opts => {
	scriptDebug("Merging following configs");
	scriptDebug([
		"Base Config",
		//opts.devserver ? "Dev Server Config" : false
	].filter(Boolean).map(highlight).join(",\n"))

	return merge(
		baseConfig,
		_getConfig(envConfigs, "Environment", opts.env),
		_getConfig(targetConfigs, "Target", opts.target),
		//opts.devserver ? miscConfigs.devserver : null
	)
}

const defaultConfigName = "Unnamed Config";

exports.getTargetName = target => {
	try {
		return targetConfigs[target].name || defaultConfigName
	} catch {
		return defaultConfigName;
	}
}