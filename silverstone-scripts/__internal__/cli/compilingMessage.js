const { redBright, greenBright, yellowBright } = require("chalk");
const { Animatable } = require("./Animatable");
const { plural } = require("../utils");

const onPresent = (value, fn) => {
	if (value >= 1) return fn(value);
	else return "";
}

const compilingMessage = module.exports.compilingMessage = new Animatable.Template([
	"Compiling",
	[".  ", ".. ", "...", "   "],
	" ",
	props => props.percentage && props.percentage === 1 ? greenBright("100") : (props.percentage * 100).toFixed(1) + "%",
	" (",
	props => props.completedCompilerCount, "/", props => props.totalCompilerCount, " completed",
	/* errors and warnings */
	props => onPresent(props.criticalErrors, v => ", " + redBright(`${v} critical error${plural(v)}`)),
	props => onPresent(props.compilationErrors, v => ", " + redBright(`${v} compilation error${plural(v)}`)),
	props => onPresent(props.compilationWarnings, v => ", " + yellowBright(`${v} compilation warning${plural(v)}`)),
	")"
], {
	interval: 400,
	defaultProps: {
		percentage: 0,
		completedCompilerCount: 0,
		totalCompilerCount: 0,
		criticalErrors: 0,
		compilationErrors: 0,
		compilationWarnings: 0
	}
});