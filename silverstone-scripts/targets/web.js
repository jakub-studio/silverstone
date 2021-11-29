const { DefinePlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { getHTMLTemplateParameters, resolveToCwd, s } = require("../config_utils");

module.exports = vars =>  ({
	name: "Web",
	entry: resolveToCwd("src", "renderer", "index.tsx"),
	target: "web",
	output: {
		path: resolveToCwd("dist", "web"),
		filename: "scripts.js"
	},
	plugins: [
		new DefinePlugin({
			__WEB__: true,
			__SSTN_REACT_ROOT__: s(vars.reactRootId)
		}),
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: resolveToCwd("src", "renderer_mount.html"),
			templateParameters: getHTMLTemplateParameters(vars)
		})
	]
});