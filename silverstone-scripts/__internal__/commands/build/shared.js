const commands = module.exports.commands = {
	ERROR: "ERR",
	STATUS: "STT",
	DURATION: "DUR",
	HASH: "HSH",
	PROGRESS_PERCENTAGE: "PRP",
	PROGRESS_MESSAGE: "PRM",
	CONFIG_DISPLAY_NAME: "CDN",
	WEBPACK_ERROR: "WPE",
	WEBPACK_WARNING: "WPW"
}

module.exports.statuses = {
	PREPARING: "PREPARING",
	RUNNING: "RUNNING",
	CRITICAL_ERROR: "CRITICAL_ERROR",
	FINISHED: "FINISHED"
}

/* Sending messages */

const _createSendFunction = command => {
	return message => {
		if (!message) process.send(command);
		else process.send(`${command}:${message}`);
	}
}

const sendError = _createSendFunction(commands.ERROR);

module.exports.send = {
	error: err => {
		sendError(err);
		process.exit(1);
	},
	hash: _createSendFunction(commands.HASH),
	status: _createSendFunction(commands.STATUS),
	progressPercentage: _createSendFunction(commands.PROGRESS_PERCENTAGE),
	progressMessage: _createSendFunction(commands.PROGRESS_MESSAGE),
	duration: _createSendFunction(commands.DURATION),
	configDisplayName: _createSendFunction(commands.CONFIG_DISPLAY_NAME),
	webpackError: _createSendFunction(commands.WEBPACK_ERROR),
	webpackWarning: _createSendFunction(commands.WEBPACK_WARNING),
}

/* Receiving messages */

module.exports.parse = str => {
	const command = str.substring(0, 4);
	const hasData = command[3] === ":";

	return {
		command: command.substring(0, 3),
		data: hasData ? str.substring(4) : null
	}
}

module.exports.constants = {
	OUTPUT_PROGRESS_ARG: "!!output-percentage"
}