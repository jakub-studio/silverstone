const { DefinePlugin } = require("webpack");

module.exports = variables => ({
	name: "Development",
	mode: "development",
	plugins: [
		new DefinePlugin({
			__DEV__: true
		})
	]
});