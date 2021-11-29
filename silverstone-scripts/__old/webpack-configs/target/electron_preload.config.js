const { paths, outputFilenames } = require("../../../silverstone.config");
const { getElectronTarget } = require("../../utils");

module.exports = {
	name: "Electron Preload",
	entry: paths.entry.preload,
	target: getElectronTarget("preload"),
	output: {
		filename: outputFilenames.preload
	}
}