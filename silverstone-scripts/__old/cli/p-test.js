const Progress = require("./progress");

console.log(Progress({
	value: { current: 0, max: 10 },
	width: 20,
	showPercentage: true
}));

console.log(Progress({
	value: { current: 5, max: 10 },
	width: 20,
	showPercentage: true
}));

console.log(Progress({
	value: { current: 175, max: 300 },
	width: 20,
	showPercentage: true
}));

console.log(Progress({
	value: { current: 10, max: 10 },
	width: 20,
	showPercentage: true
}) + " Succesfully completed all builds.");