const { DefinePlugin } = require("webpack");

module.exports = variables => ({
	name: "Production",
	mode: "production",
	plugins: [
		new DefinePlugin({
			__DEV__: false
		})
	]
});