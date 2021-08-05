const run = require("@doyensec/electronegativity")
const config = require("../../../silverstone.config");

module.exports = () => {
	run({
		input: config.paths.dist.app
	}, true)
}