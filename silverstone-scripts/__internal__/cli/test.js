const { clear, cursor } = require(".");
const { redBright, greenBright, yellowBright } = require("chalk");
const { Animatable } = require("./Animatable");
const { plural } = require("../utils");
const { StickyLine } = require("./sticky_line");


//console.log(`Compiling... ${greenBright("100%")} (2/3 completed, ${redBright("1 critical error")}, ${redBright("1 compilation error")}, ${yellowBright("2 compilation warnings")})`);
/* process.stdout.write("hello")


process.stdout.moveCursor(0, 0, () => {
	process.stdout.write("hi")
}); */

const onPresent = (value, fn) => {
	if (value >= 1) return fn(value);
	else return "";
}

const CompilingMessage = new Animatable.Template([
	"Compiling",
	[".  ", ".. ", "...", "   "],
	" ",
	props => props.percentage && props.percentage === 1 ? greenBright("100") : (props.percentage * 100).toFixed(1) + "%",
	" (",
	props => props.completedCompilerCount,
	"/",
	props => props.totalCompilerCount,
	" completed",
	props => onPresent(props.criticalErrors, v => ", " + redBright(`${v} critical error${plural(v)}`)),
	props => onPresent(props.compilationErrors, v => ", " + redBright(`${v} compilation error${plural(v)}`)),
	props => onPresent(props.compilationWarnings, v => ", " + yellowBright(`${v} compilation warning${plural(v)}`)),
	")"
], {
	interval: 200,
	defaultProps: {
		percentage: 0,
		completedCompilerCount: 0,
		totalCompilerCount: 0,
		criticalErrors: 0,
		compilationErrors: 0,
		compilationWarnings: 0
	}
});

const line = new StickyLine();
const message = Animatable.useWithStickyLine(CompilingMessage, line);
message.start();