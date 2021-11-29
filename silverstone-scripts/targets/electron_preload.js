const { resolveToCwd, getElectronTarget } = require("../config_utils");

module.exports = vars => ({
	name: "Electron Preload",
	entry: resolveToCwd("src", "preload", "index.ts"),
	target: getElectronTarget("preload"),
	output: {
		filename: "preload.js"
	}
});