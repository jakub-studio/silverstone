const open = require("open");
const config = require("../../../silverstone.config");
const { join } = require("path");

module.exports = () => {
	open(
		join(config.paths.dist.web, config.outputFilenames.webHTML)
	)
}