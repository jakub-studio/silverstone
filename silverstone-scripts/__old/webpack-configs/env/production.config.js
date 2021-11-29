const { DefinePlugin } = require("webpack");

module.exports = {
	name: "Production",
	mode: "production",
	plugins: [
		new DefinePlugin({
			__DEV__: false
		})
	]
}