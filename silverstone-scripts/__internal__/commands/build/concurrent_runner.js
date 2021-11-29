const { resolve } = require("path");
const { fork } = require("child_process");
const { options } = require("../../../config.json");
const { constants, parse, statuses: states, commands } = require("./shared");
const { StickyLine } = require("../../cli/sticky_line");
const { Animatable } = require("../../cli/Animatable");
const { compilingMessage } = require("../../cli/compilingMessage");
const { redBright } = require("chalk");
const { highlight, log } = require("../../cli");
const { inspect } = require("../../utils");

const compilerFilename = resolve(__dirname, "compiler.js");
const progressTrackingEnabled = options.compilerOutputPercentage;

/**
 * @typedef {[string, string]} Job
 */

/**
 * @typedef {Array<JobArray>} JobsArray
 */

class CompilerProcess {
	/**
	 * 
	 * @param {Job} job 
	 * @param {number} id 
	 * @param {Runner} parent 
	 */
	constructor(job, id, parent) {
		this.job = job;
		this.id = id;
		this.parent = parent;
		this.process = null;
		this.data = {
			state: states.PREPARING,
			hash: null,
			duration: null,
			criticalError: null,
			webpackErrors: [],
			webpackWarnings: [],
			progress: progressTrackingEnabled ? {
				message: "",
				percentage: 0
			} : null
		}
	}
	get name () {
		return this.job[1];
	}
	get isFinished () {
		return this.data.state === states.FINISHED;
	}
	spawn() {
		this.process = fork(compilerFilename, this._getArguments(), { stdio: ["pipe", "pipe", "pipe", "ipc"] });
		this._attachListeners();
	}
	_getArguments() {
		return [
			...this.job,
			progressTrackingEnabled ? constants.OUTPUT_PROGRESS_ARG : null
		].filter(Boolean);
	}
	_attachListeners() {
		this.process.on("message", this._handleMessage.bind(this));

		this.process.stderr.on("data", err => {
			console.error("stderr " + err.toString())
		});

		this.process.on("error", err => {
			console.error("generic:err" + err)
		});
	}
	_pushUpdate(command) {
		this.parent._update(this.id, command);
	}
	_handleMessage(message) {
		const { command, data } = parse(message);
		switch (command) {
			case [commands.STATUS]:
				this.data.state = data;
				this._pushUpdate(commands.STATUS);
				return;
			case commands.ERROR:
				this.data.criticalError = data;
				this.data.state = states.CRITICAL_ERROR;
				this._pushUpdate(commands.ERROR);
				return;
			case [commands.DURATION]:
				this.data.duration = data;
				return;
			case [commands.HASH]:
				this.data.hash = data;
				return;
			case [commands.PROGRESS_PERCENTAGE]:
				if (!progressTrackingEnabled) return;
				this.data.progress.percentage = Number(data);
				this._pushUpdate(commands.PROGRESS_PERCENTAGE);
				return;
			case [commands.PROGRESS_MESSAGE]:
				if (!progressTrackingEnabled) return;
				this.data.progress.message = data;
				this._pushUpdate(commands.PROGRESS_MESSAGE);
				return;
			case [commands.CONFIG_DISPLAY_NAME]:
				// @todo
				return;
			case [commands.WEBPACK_ERROR]:
				this.data.webpackErrors.push(data);
				this._pushUpdate(commands.WEBPACK_ERROR);
				return;
			case [commands.WEBPACK_WARNING]:
				this.data.webpackWarnings.push(data);
				this._pushUpdate(commands.WEBPACK_WARNING);
				return;
			default:
				log.error(`CompilerProcess._handleMessage recieved an unsupported command from a child process. Receievd ${inspect(command)} in message ${inspect(message)}.`);
				return;
		}
	}
}

const Runner = module.exports.Runner = class Runner {
	/**
	 * @param {JobsArray} jobs
	 * @example const runner = new Runner([
	 * ["development", "web"]
	 * ]);
	 * runner.run();
	 */
	constructor(jobs) {
		/**
		 * @type {JobsArray}
		 */
		this.jobs = jobs;
		/**
		 * @type {CompilerProcess[]}
		 */
		this.processes = [];
		this.cli = new RunnerCLI({
			totalCompilerCount: jobs.length,
		});

		this.running = false;
	}
	_update (id, command) {
		const callerProcess = this.processes[id];
		console.log(callerProcess.data);

		switch (command) {
			case [commands.STATUS]:

				return;
			case commands.ERROR:
				this.cli.logCriticalError(callerProcess.name, this.processes[id].data.criticalError);
				return;
			case [commands.PROGRESS_PERCENTAGE]:

				return;
			case [commands.PROGRESS_MESSAGE]:

				return;
			case [commands.WEBPACK_ERROR]:

				return;
			case [commands.WEBPACK_WARNING]:

				return;
			default:
				log.error("Runner._update recieved a command that is unsupported. Ensure that there is a case handler for the specified command.");
				return;
		}
	}
	#setup() {
		this.jobs.forEach((job, index) => {
			const proc = new CompilerProcess(job, index, this)
			this.processes.push(proc);

			proc.spawn();
		});
	}
	checkProgression () {
		const finished = [];
	}
	onFinish () {
		this.processes.forEach()
		this.cli.finish();
	}
	run() {
		return new Promise((res, rej) => {
			this.#setup();
		})
	}
}

const RunnerCLI = class RunnerCLI {
	constructor(initialProps={}) {
		/**
		 * @type {StickyLine}
		 */
		this.stickyLine = new StickyLine();
		/**
		 * @type {Animatable}
		 */
		this.message = Animatable.useWithStickyLine(compilingMessage, this.stickyLine);
		this.message.setProps(initialProps);
		this.message.start();
	}
	logCriticalError (name, data) {
		this.stickyLine.logAbove(
			redBright("critical error ") +
			`The ${highlight(name)} compiler process has emitted the following critical error and has been killed.\nError details: ` +
			data
		)
		this.message.incrementProp("criticalErrors");
	}
	finish () {
		// Stop compiling animation
		this.message.stop();
		// Finish sticky line
		this.stickyLine.stop();
	}
}