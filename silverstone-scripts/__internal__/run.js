#!/usr/bin/env node

const { debug, inspect, is, objectForEach, debugName } = require("./utils");
const { log, list, success, highlight } = require("./cli");
const AliasMap = require("./AliasMap");

const commandList = require("./commands");
const commandMap = new AliasMap();

objectForEach(commandList, (key, value) => {
	commandMap.set(key, value[0], value[1])
});

const command = (commandName => {
	const throwError = () => {
		log.error("No command provided.", `Run '${highlight("npx sstn help")}' for more information.`);
		process.exit(1);
	}

	if (!commandName) {
		throwError();
	}

	// Check if it is -l or --log-debug and throw if true.
	if (debugName.includes(commandName)) {
		throwError();
	}

	return commandName.toLowerCase();
})(process.argv[2]);

const args = require("minimist")(process.argv.splice(3));

if (debug) {
	log.debug("silverstone cli");
	log.debugDivider();
	log.debug("process.argv: " + inspect(process.argv));
	log.debugDivider();
	log.debug("CLI Input", list({
		"Command": inspect(command),
		"Arguments": inspect(args)
	}, false))
	log.debugDivider();
}


const commandIdentifier = commandMap.get(command);
if (!commandIdentifier) {
	log.error(`Unable to run command '${command}'.`, "This command does not exist.");
	process.exit(1);
}

log.debug(`command ${inspect(command)} resolved to ${inspect(commandIdentifier)}`);

const commandObject = require(`./commands/${commandList[commandIdentifier][0]}`);

let currentArgs = args;

if (is(commandObject.validate, "function")) {
	log.debug(`${commandIdentifier}.validate function found. Executing...`)
	try {
		const valid = commandObject.validate(currentArgs);

		if (!valid) {
			log.error(`Exiting due to command '${commandIdentifier}' validate (exports.validate) function returning value that is not true.`);
			process.exit(1);
		} else log.debug(`${commandIdentifier}.validate returned ${success("true")}`)
	} catch (e) {
		log.error(`Exiting due to command '${commandIdentifier}' validate (exports.validate) function throwing an error.`, e);
		process.exit(1);
	}
}

if (is(commandObject.prepare, "function")) {
	log.debug(`${commandIdentifier}.prepare function found. Executing...`)

	try {
		currentArgs = commandObject.prepare(currentArgs);
		log.debug(`${commandIdentifier}.prepare function executed succesfully.`, "Prepared Arguments: " + inspect(currentArgs))
	} catch (e) {
		log.error(`Exiting due to command '${commandIdentifier}' prepare (exports.prepare) function throwing an error.`, e);
		process.exit(1);
	}
}

if (!is(commandObject.run, "function")) {
	log.error(`Exiting due to command '${commandIdentifier}' not having a run export (exports.run) that is a function.`);
	process.exit(1);
}

try {
	log.debug(`Executing ${commandIdentifier}.run...`)
	log.debugDivider();
	commandObject.run(currentArgs);
} catch (e) {
	log.error(`${commandIdentifier}.run threw an error.`, e);
}