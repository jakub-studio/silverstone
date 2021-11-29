const { greenBright, grey } = require("chalk");

const getPercentage = opts => {
	return (typeof opts.value === "object" ? Math.ceil(opts.value.current / opts.value.max * 100) : opts.value);
}

const getColourFn = (opts, percent) => {
	if (typeof opts.colourOn100 === "function" && percent === 100) return opts.colourOn100;
	if (opts.colourOn100 === true && percent === 100) return greenBright;
	if (typeof opts.colour === "function") return opts.colour;
	if (opts.colour === false) return str => str;
	return grey;
}

module.exports = {
	Percentage: (opts={}) => {
		const percent = getPercentage(opts);
		const colourFn = getColourFn(opts, percent);
	
		return colourFn(percent + "%");
	},
	getPercentage
}