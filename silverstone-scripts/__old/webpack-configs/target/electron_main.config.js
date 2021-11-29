const { DefinePlugin } = require("webpack");
const { paths, outputFilenames } = require("../../../silverstone.config");
const { getElectronTarget } = require("../../utils");

module.exports = {
	name: "Electron Main",
	entry: paths.entry.main,
	target: getElectronTarget("main"),
	output: {
		filename: outputFilenames.main
	},
	plugins: [
		new DefinePlugin({
			__SS_FILENAME_RENDERER_MOUNT__: JSON.stringify(outputFilenames.rendererHTML),
			__SS_FILENAME_PRELOAD__: JSON.stringify(outputFilenames.preload)
		})
	]
}