const { DefinePlugin } = require("webpack");

module.exports = {
	name: "Development",
	mode: "development",
	plugins: [
		new DefinePlugin({
			__DEV__: true
		})
	]
}

