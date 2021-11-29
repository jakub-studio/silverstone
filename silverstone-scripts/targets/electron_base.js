const { resolveToCwd } = require("../config_utils");
const { DefinePlugin } = require("webpack");

module.exports = vars => ({
	name: "Electron Base",
	output: {
		path: resolveToCwd("dist", "app")
	},
	plugins: [
		new DefinePlugin({
			__WEB__: false
		})
	]
});