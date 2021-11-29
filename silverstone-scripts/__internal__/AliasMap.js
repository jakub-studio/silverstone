/**
 * @file AliasMap class.
 * @todo JSDOC
 */

const { handleStringArrayArg } = require("./utils");

// Helper class that holds two simple objects.
// 1. The value object, this stores the base keys and their associated values.
// 2. The keymap object, this essentially holds references to a representing key
// in the value object.
// e.g. aliasmap.values = { key_1: "hello" }
// e.g. aliasmap.keymap = { key_1: "key_1", key_1_alias: "key_1" }
// e.g. aliasmap.get("key_1_alias") -> "hello"

module.exports = class AliasMap {
	constructor (intialValues) {
		this.values = intialValues || {};
		this.keymap = {};
	}

	/**
	 * 
	 * @param {string} key The main key referring to the data.
	 * @param {any} data The respective data to be set.
	 * @param {(string|string[])?} aliasesArg 
	 */
	set (key, data, aliasesArg) {
		this.values[key] = data;
		this.keymap[key] = key;

		const aliases = handleStringArrayArg(aliasesArg);
		if (aliases.length >= 1) {
			this.setAliases(aliases, key)
		}
	}

	/**
	 * 
	 * @param {string} key Key of the item to lookup.
	 * @returns {any}
	 */
	get(key) {
		const valueKey = this.__lookupValueKey(key);
		if (!valueKey) return;
		return this.values[valueKey];
	}

	/**
	 * 
	 * @param {string} key Key of the item to check if present.
	 * @returns {boolean}
	 */
	has (key) {
		const valueKey = this.__lookupValueKey(key);
		if (!valueKey) return false;
		return this.values.hasOwnProperty(valueKey);
	}

	/**
	 * 
	 * @param {string} key Key of the item to delete.
	 * @returns {boolean} Boolean indicating whether the delete operation was successful.
	 */
	delete (key) {
		const valueKey = this.__lookupValueKey(key);
		if (!valueKey) return false;

		delete this.values[valueKey];
		delete this.keymap[valueKey];
		if (valueKey !== key) {
			delete this.keymap[key];
		}

		Object.keys(this.keymap).forEach(_key => {
			const reference = this.keymap[_key];

			if (reference === valueKey) {
				delete this.keymap[_key]
			}
		});

		return true;
	}
	setAliases (strings, key) {
		handleStringArrayArg(strings).forEach(alias => {
			this.keymap[alias] = key
		})
	}

	__lookupValueKey (key) {
		return this.keymap[key];
	}
}