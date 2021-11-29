const { list, log, highlight } = require("../../cli");
const { getArgument, inspect } = require("../../utils");
const { resolve } = require("../../config");
const { Runner } = require("./concurrent_runner");


/**
 * @typedef {object} BuildOptions
 * @property {string} env
 * @property {string[]} target
 */

module.exports.validate = args => {
	const envArg = args._[0];
	const targetArg = args._[1];

	if (!envArg) return log.error("No environment argument was provided for build command");
	if (!targetArg) return log.error("No target argument was provided for build command");

	return true;
}

module.exports.prepare = args => {
	const envArg = args._[0];
	const targetArg = args._[1];

	return {
		env: envArg,
		target: targetArg.split(",")
	}
}

/**
 * @param {BuildOptions} opts
 */
module.exports.run = opts => {
	return new Promise((res, rej) => {
		const { env, target } = resolve(opts.env, opts.target);
		if (target.length === 0) {
			log.error("Unable to resolve any targets. Exiting...");
			process.exit(1);
		}

		console.log(`Building ${highlight(env.name)} for the following targets: ${target.map(cfg => highlight(cfg.name))}.`);
		console.log(`Initiating ${highlight(target.length)} concurrent child webpack compiler processes.`);
		log.divider();

		const runner = new Runner(target.map(targetConfig => [env.name, targetConfig.name]));

		runner.run();
		runner.cli.stickyLine.logAbove(`Builds started at ${new Date().toLocaleTimeString()}`)

		resolve();
	});
}

module.exports.help = {
	name: "Build"
}