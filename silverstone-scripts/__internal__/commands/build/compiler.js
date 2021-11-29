const webpack = require("webpack");
const ms = require("ms");
const { configStores } = require("../../config");
const { commands, send, constants, statuses } = require("./shared");

const cache = {
	progressPercentage: 0,
	progressMessage: ""
}

const executeBuild = (env, target) => {
	const retrieved = configStores.target.get(target);

	return send.error("error boo not found :(")

	if (!retrieved) {
		return send.error("Target sent to compiler does not resolve.")
	}

	if (retrieved.type === "group") {
		return send.error("Target sent to compiler resolves to group.")
	}

	const config = retrieved.data.get(env);
	if (process.argv.includes(constants.OUTPUT_PROGRESS_ARG)) {
		if (!Array.isArray(config.plugins)) {
			config.plugins = [];
		}

		config.plugins.push(new webpack.ProgressPlugin({
			handler (percentage, message) {
				if (percentage !== cache.progressPercentage) {
					cache.progressPercentage = percentage;
					send.progressPercentage(percentage);
				}

				if (message !== cache.progressMessage) {
					cache.progressMessage = message;
					send.progressMessage(message);
				}
			}
		}))
	}
	const compiler = webpack(config);
	send.status(statuses.RUNNING);
	if (config.name) {
		send.configDisplayName(config.name);
	}

	compiler.run((err, stats) => {
		if (err) send.error(err);

		const buildDuration = stats.compilation.endTime - stats.compilation.startTime;
		send.duration(buildDuration);
		if (stats.compilation.hash) {
			send.hash(stats.compilation.hash);
		}

		if (stats.hasErrors() || stats.hasWarnings()) {
			const statsJson = stats.toJson({
				chunks: false,
				chunkGroups: false,
				assets: false,
				entrypoints: false,
				modules: false,
			});

			if (statsJson.warnings && statsJson.warnings.length && (statsJson.warnings.length > 0)) {
				statsJson.warnings.forEach(warning => {
					send.webpackWarning(warning.message)
				});
			}

			if (statsJson.errors && statsJson.errors.length && (statsJson.errors.length > 0)) {
				statsJson.errors.forEach(error => {
					send.webpackError(error.message);
				});
			}
		}

		send.status(statuses.FINISHED);
	});
}

if (typeof process.send === "function") {
	// is child process
	executeBuild(process.argv[2], process.argv[3]);
} else {
	// is main process
	module.exports = executeBuild;
}


// ----------------------------
// ----------------------------
// ----------------------------
// ----------------------------
/* 
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const { success } = require("../../utils");
const { getConfig } = require("../../webpack-configs");
const ms = require("ms");

const args = (() => {
	const split = process.argv.slice(2).map(s => s.split("="));
	const final = {};

	split.forEach(arg => {
		if (arg.length === 1) {
			final[arg[0]] = true;
		} else {
			final[arg[0]] = arg[1];
		}
	});

	return final;
})();

const consoleDispatch = data => {
	let str = `${args.id}:${data.op}`
	if (data.args) str = str + ":" + data.args.join("||");
	// console.log(str);
}

const exec = (opts, onDispatch) => {
	if (!onDispatch) onDispatch = () => {};
	onDispatch({op: "PREPARING"});

	const compiler = webpack(merge(
		getConfig(opts),
		{plugins: [
			new webpack.ProgressPlugin({
				handler (percentage) {
					onDispatch({op: "COMPILE_PROGRESS_UPDATE", args: [percentage]})
				}
			})
		]}
	));

	compiler.run((err, s) => {
		if (err) return console.error(err);
		const stats = s.toJson({
			chunks: false,
			chunkGroups: false,
			assets: false,
			entrypoints: false,
			modules: false,
			children: false,
		});

		console.log(`Built ${success(stats.name)} successfully in ${success(ms(stats.time, { long: true }))}. (Hash: ${stats.hash})`)
	})
}

if (args.is_multiple) {
	exec(args, consoleDispatch)
} else {
	module.exports = exec;
} */