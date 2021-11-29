const { paths } = require("../../../silverstone.config");
const { DefinePlugin } = require("webpack");

module.exports = {
	name: "Electron Base",
	output: {
		path: paths.dist.app
	},
	plugins: [
		new DefinePlugin({
			__WEB__: false
		})
	]
}