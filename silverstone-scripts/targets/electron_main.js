const { resolveToCwd, getElectronTarget, s } = require("../config_utils");

module.exports = vars => ({
	name: "Electron Main",
	entry: resolveToCwd("src", "main", "index.ts"),
	target: getElectronTarget("main"),
	output: {
		filename: "main.js"
	}
});