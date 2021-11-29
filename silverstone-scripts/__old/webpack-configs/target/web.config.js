const { DefinePlugin } = require("webpack");
const { paths, outputFilenames, misc } = require("../../../silverstone.config");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	name: "Web",
	entry: paths.entry.renderer,
	target: "web",
	output: {
		path: paths.dist.web,
		filename: outputFilenames.webScripts
	},
	plugins: [
		new DefinePlugin({
			__WEB__: true,
			__SS_REACT_ROOT__: JSON.stringify(misc.reactRootId)
		}),
		new HtmlWebpackPlugin({
			filename: outputFilenames.webHTML,
			template: paths.entry.rendererHTML,
			templateParameters: Object.assign({
				__REACT_ROOT__: misc.reactRootId
			}, misc.htmlTemplateParams)
		})
	]
}