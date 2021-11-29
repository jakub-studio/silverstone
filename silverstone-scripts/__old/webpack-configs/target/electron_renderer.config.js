const { paths, outputFilenames, misc } = require("../../../silverstone.config");
const { getElectronTarget } = require("../../utils");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");

module.exports = {
	name: "Electron Renderer",
	entry: paths.entry.renderer,
	target: getElectronTarget("renderer"),
	output: {
		filename: outputFilenames.renderer
	},
	plugins: [
		new DefinePlugin({
			__SS_REACT_ROOT__: JSON.stringify(misc.reactRootId),
		}),
		new HtmlWebpackPlugin({
			filename: outputFilenames.rendererHTML,
			template: paths.entry.rendererHTML,
			templateParameters: Object.assign({
				__REACT_ROOT__: misc.reactRootId
			}, misc.htmlTemplateParams)
		})
	]
}