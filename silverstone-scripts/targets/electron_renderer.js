const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
const { getElectronTarget, resolveToCwd, getHTMLTemplateParameters, s } = require("../config_utils");

module.exports = vars => ({
	name: "Electron Renderer",
	entry: resolveToCwd("src", "renderer", "index.tsx"),
	target: "web", /* getElectronTarget("renderer") */
	// ^ Change to commented value if enabling nodeIntegration.
	output: {
		filename: "renderer.js"
	},
	plugins: [
		new DefinePlugin({
			__SSTN_REACT_ROOT__: s(vars.reactRootId),
		}),
		new HtmlWebpackPlugin({
			filename: "renderer_mount.html",
			template: resolveToCwd("src", "renderer_mount.html"),
			templateParameters: getHTMLTemplateParameters(vars)
		})
	]
});