const { greenBright, grey, green } = require("chalk");
const { Percentage, getPercentage } = require("./percentage");

const renderChar = (char, length) => {
	return Array(length + 1).join(char);
}

module.exports = (opts={}) => {
	if (!opts.width) return "[]";

	const percent = getPercentage(opts);

	let filledLength = Math.ceil(percent / 100 * opts.width);
	if (filledLength > opts.width) {
		filledLength = opts.width
	}

	const emptyLength = opts.width - filledLength;

	return "[" +
		renderChar(greenBright(opts.fillChar || "X"), filledLength) +
		renderChar(grey(opts.emptyChar || "-"), emptyLength) +
	"]" +
	(opts.showPercentage ? " " + Percentage({value: percent, colourOn100: true}) : "")
}