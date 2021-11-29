const { scriptDebug, highlight } = require("../../utils");
const initConcurrentBuilds = require("./concurrent");

const electronAllTargetsIdentifiers = ["electron-all", "electron-*", "e-*"];
const electronAllTargets = ["electron-main", "electron-preload", "electron-renderer"];

module.exports = opts => {
	let targets = opts.target.split(",");

	if (targets.find(t => electronAllTargetsIdentifiers.includes(t))) {
		// Removes electronAllTargetIdentifiers and appends all electron targets
		targets = targets.filter(t => !electronAllTargetsIdentifiers.includes(t)).concat(electronAllTargets);
	}

	scriptDebug("Targets parsed", targets.map(highlight).join(", "));

	if (targets.length === 1) {
		console.log(`Starting ${highlight`single`} webpack build`);
		require("./exec_build")({
			target: targets[0],
			env: opts.env
		});
	} else {
		console.log(`Starting ${highlight(`multiple (${targets.length})`)} webpack builds in parralel`);

		initConcurrentBuilds(targets.map(t => ({
			target: t,
			env: opts.env
		})))
	}
}