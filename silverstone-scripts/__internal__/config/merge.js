const { merge } = require("webpack-merge");
const { options: {
	mergeWebpackDefinePluginDefinitions: mergeDefinePlugin
}} = require("../../config.json");


module.exports = mergeArray => {
	const merged = merge(mergeArray);


	// Note:
	// I did previously try using webpack-merge.mergeWithCustomize to try and merge the DefinePlugin definitions
	// and ran into issues with customiseObject not firing. So I coded it this way below, running after the merge is
	// complete and honestly I think this way is better.
	if (mergeDefinePlugin && merged.plugins && Array.isArray(merged.plugins)) {
		const { DefinePlugin } = require("webpack");

		// Get all existing DefinePlugin definitions.
		const definePluginArray = merged.plugins
			.filter(plugin => plugin && plugin.constructor && plugin.constructor === DefinePlugin);

		// Return if 1 or 0 as no changes / merges / removals are needed.
		if (definePluginArray.length <= 1) return merged;

		// Merge definitions from all found instances of DefinePlugin.
		const mergedDefinitions = {};
		definePluginArray.forEach(plugin => Object.assign(mergedDefinitions, plugin.definitions));

		// Remove existing DefinePlugin instances.
		merged.plugins = merged.plugins
			.filter(plugin => plugin && plugin.constructor && plugin.constructor !== DefinePlugin);

		// Push new DefinePlugin with all definitions merged.
		merged.plugins.push(new DefinePlugin(mergedDefinitions));
	}

	return merged;
}
