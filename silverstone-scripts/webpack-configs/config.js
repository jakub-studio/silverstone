/*

work in progress, this file does nothing atm

*/

const { merge } = require("webpack-merge");
const { scriptWarning } = require("../utils");

const handleConfigArg = arg => {
	if (typeof arg === "function") return arg;
	if (typeof arg === "object") return () => arg;
	else return null;
}

module.exports = class WebpackConfig {
	constructor ({ config, name, dependencies, env }) {
		this.config = handleConfigArg(config);
		this.name = name || "Unnamed Config";
		this.env = env || false;
		this.dependencies = dependencies || [];
	}
	make ({env}) {
		const rootThis = this;
		const config = this.config({get env () {
			if (rootThis.env) scriptWarning(`config '${rootThis.name}' tried to access env property in config method whilst config itself is an env config. To remove this warning do not access env in config()`)
		}});

		const deps = this.dependencies.make();

		return merge(
			...deps,
			config,
			{ name: this.name }
		)
	}
}