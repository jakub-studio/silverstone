const { Writable } = require("stream");
const concurrently = require("concurrently");
const { getTargetName } = require("../../webpack-configs");
const { success, scriptError } = require("../../utils");

class Builds {
	constructor (builds) {
		this.builds = builds.map((build, index) => {
			return Object.assign(build, {
				id: String(index),
				progress: 0,
			})
		});
	}
	_makeExecString (build) {
		return (
			"yarn:__do_not_use_exec_build__ is_multiple " +
			`id=${build.id} ` +
			`env=${build.env} ` +
			`target=${build.target} `
		)
	}
	toCommandObjs () {
		return this.builds.map((build, index) => ({
			command: this._makeExecString(build),
			name: `Build ${index + 1}`
		}));
	}
	getCombinedProgressPercentage () {
		let combinedTotal = 0;
		this.builds.forEach(b => combinedTotal = combinedTotal + b.progress);
		return Math.ceil(combinedTotal / (100 * this.builds.length) * 100)
	}
}

class ConcurrentProcessManager extends Writable {
	constructor (builds) {
		super();
		this.builds = new Builds(builds);
	}
	_write (data) {
		// WIP
		console.log( data.toString())
	}
	onResolve () {
		console.log(success("All builds successful"))
	}
	onReject () {
		scriptError("Build failed")
	}
}

module.exports = builds => {
	const processManager = new ConcurrentProcessManager(builds);

	concurrently(
		processManager.builds.toCommandObjs(),
	).then(processManager.onResolve).catch(processManager.onReject)
}