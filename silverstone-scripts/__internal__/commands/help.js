const { highlight } = require("../cli");
const { objectForEach, handleStringArrayArg } = require("../utils");

/**
 * @todo 
 */

module.exports.prepare = (args) => {

	const commandsIndex = require("./index.json");
	const data = {
		requested: args
	};
	objectForEach(commandsIndex, (key, value, object) => {
		data[key] = {
			name: key,
			aliases: handleStringArrayArg(value[1]),
			help: require(`./${value[0]}`).help
		}
	});
	return data;
}

module.exports.run = (data) => {
	console.log("silverstone help\n");
	console.log(`All commands (run '${highlight("npx sstn help <command-name>")}' for more information):`);
	console.log(Object.keys(data).map(highlight).join(", "))
}

module.exports.help = {
	name: "Help",
	desc: "Get help for commands."
}