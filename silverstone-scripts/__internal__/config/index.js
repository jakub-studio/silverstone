const path = require("path");
const AliasMap = require("../AliasMap");
const merge = require("./merge");
const { log } = require("../cli");
const { objectForEach, paths, handleStringArrayArg } = require("../utils");
const userConfigJSON = module.exports.configJSON = require("../../config.json");

/**
 * @typedef {"env"|"target"} ConfigType
 */

/**
 * Config instance options object.
 * @typedef {object} ConfigOptions
 * @property {string} name The name of the configuration.
 * @property {ConfigType} type
 * @property {string} path Absolute path pointing to the config file.
 * @property {string=} inherits Name of config to inherit data from and build ontop of.
 * @property {string|string[]=} aliases Aliases that can be used to refer to the config.
 * @property {boolean=} dependency Indicates whether this config is marked as a dependency. If `true`
 * then the config cannot be passed to the build command as it's considered incomplete. Used mainly
 * for "base" configs that other configs build ontop of.
 */


const normaliseConfigDataLoader = (data) => {
	if (typeof data === "function") {
		return data
	} else return () => data;
}

const buildVariablesObject = env => {
	return Object.assign({}, this.configJSON.variables, { env })
}

/**
 * Config class that eases working with configuration declarations.
 */
const Config = module.exports.Config = class Config {
	/**
	 * 
	 * @param {Config} config 
	 */
	static _getDataLoader (config) {
		if (config._cachedDataLoader) return config._cachedDataLoader;

		const absoluteCfgPath = config._resolvePath();

		try {
			const dataLoader = normaliseConfigDataLoader(require(absoluteCfgPath));
			config._cachedDataLoader = dataLoader;

			return dataLoader;
		} catch (e) {
			log.error(`Error whilst trying to load configuration file (${config.type}: ${config.name}) (path relative: ${config.path}) (path absolute: ${absoluteCfgPath})`, e)
		}
	}

	/**
	 * 
	 * @param {Config} topConfig 
	 */
	static _handleInheritance (topConfig, vars) {
		const { inherits: inheritsName, type } = topConfig;

		const inheritConfig = configStores[type].get(inheritsName);

		if (!inheritConfig) {
			log.error(
				"Error whilst trying to handle configuration inheritance.",
				`Config '${inheritsName}' was unable to be resolved. Inheritor config is '${topConfig.name}'. Double check for any spelling errors.`
			);
			process.exit(1);
		}

		if (inheritConfig.type === "group") {
			log.error(
				"Error whilst trying to handle configuration inheritance.",
				`Identifier '${inheritsName}' is unable to be inherited by '${topConfig.name}' as the identifier points to a group declaration. Groups are unable to be inherited. `
			);
			process.exit(1);
		}

		const inheritConfigLoader = Config._getDataLoader(inheritConfig.data);

		let final = [inheritConfigLoader(vars)]

		if (inheritConfig.data.inherits) {
			final = final.concat(Config._handleInheritance(inheritConfig.data, vars));
		}

		return final;
	}

	/**
	 * @param {ConfigType} type
	 * @param {string} name Configuration name.
	 * @param {*} data 
	 * @returns {Config}
	 */
	static fromDeclaration (type, name, data) {
		const additionalOptions = data[1] || {};
	
		return Config.create({
			name,
			type,
			path: data[0],
			dependency: additionalOptions.dependency,
			inherits: additionalOptions.inherits,
			aliases: additionalOptions.aliases
		});
	}

	/**
	 * Config.create is the only public permitted way to create Config instances to ensure
	 * that cache is managed properly. Do not use `new Config()` outside of this method.
	 * @param {ConfigOptions} opts 
	 * @returns {Config}
	 * @todo possibly remove as currently unneeded
	 */
	static create (opts) {
		return new Config(opts);
	}

	/**
	 * Do not use the constructor outside of the static `Config.create` method as otherwise you
	 * are skipping the configCache.
	 * @private
	 * @hideconstructor
	 * @param {ConfigOptions} opts
	 */
	constructor (opts) {
		/**
		 * Basic name of the config
		 * @type {string}
		 * @readonly
		 */
		this.name = opts.name;

		/**
		 * @type {ConfigType}
		 */
		this.type = opts.type;

		/**
		 * Relative (config-provided) file path to config file.
		 * @type {string}
		 * @readonly
		 */
		this.path = opts.path;

		/**
		 * Absolute path to config file. Remains `null` until the config data is requested, then `Config.path` is
		 * processed with `require("path").resolve` and the output will be saved here.
		 * @type {string}
		 */
		this.resolvedPath = null;
	
		/**
		 * Display name of the config file. Is obtained when the config file is read, loaded and a string property
		 * named `name` is present.
		 * @type {string}
		 * @todo add webpack config#name url to desc above.
		 */
		this.displayName = null;

		/**
		 * Indicates whether the config is considered a dependency and cannot be run on it's own.
		 * @readonly
		 * @type {boolean}
		 */
		this.dependency = Boolean(opts.dependency);

		/**
		 * Config to inherit data from and build ontop of.
		 * @readonly
		 * @type {string}
		 */
		this.inherits = opts.inherits;

		/**
		 * @readonly
		 * @type {string[]}
		 */
		this.aliases = handleStringArrayArg(opts.aliases);

		/**
		 * @private
		 */
		this._cachedDataLoader = null;
	}
	/**
	 * Gets the absolute path to the config file, saves it to `Config.resolvedPath` and returns it.
	 * @private
	 * @returns {string}
	 */
	_resolvePath () {
		if (this.resolvedPath) return this.resolvedPath;
		this.resolvedPath = path.resolve(paths.silverstone, this.path);
		return this.resolvedPath;
	}
	get (env) {
		return this._build(env);
	}
	/**
	 * @private
	 */
	_build (env) {
		const vars = buildVariablesObject(this._getEnvVariablesProperty(env));
		const selfData = Config._getDataLoader(this)(vars);

		const envData = env ? configStores.env.get(env).data.get() : {};
		let mergeArray = [selfData];

		if (this.inherits) {
			mergeArray.push(...Config._handleInheritance(this, vars));
		}

		mergeArray.push(envData);
		mergeArray.reverse()

		return merge(mergeArray);
	}
	_getEnvVariablesProperty (env) {
		if (this.type === "env") return this.name;
		else return env;
	}
	get fullDisplayName () {
		if (!this.displayName) return this.name;
		else return `${this.displayName} (${this.name})`;
	}
}

/**
 * @private
 * @todo jsdoc
 * @param {string} targetName Target config name to resolve
 * @returns {Config[]}
 */

const _resolveTarget = (targetName) => {
	const targetResult = configStores.target.get(targetName);

	const targetType = targetResult && targetResult.type;

	if (targetType == undefined) {
		log.warning(`Unable to resolve target config named '${targetName}'`, "Please double check for any spelling mistakes and/or ensure a configuration with that name or alias exists. Skipping this target..");
		return [];
	}

	let targetOutput;
	if (targetType === "config") {
		targetOutput = [targetResult.data]
	}
	if (targetType === "group") {
		targetOutput = targetResult.data.configs.map(name => configStores.target.get(name).data)
	}

	return targetOutput;
}

/**
 * 
 * @param {string} env Env config name to resolve.
 * @param {string|string[]} targets Target(s) to resolve.
 * @returns 
 */

module.exports.resolve = (env, targets) => {
	const envResult = configStores.env.get(env);

	// TODO explain following lines
	const targetsArray = [...new Set(handleStringArrayArg(targets).map(_resolveTarget).flat())]

	return {
		env: envResult && envResult.data,
		target: targetsArray
	}
}

const configStores = exports.configStores = {
	env: new AliasMap(),
	target: new AliasMap()
}

/**
 * 
 * @param {object} object 
 * @param {ConfigType} type
 * @param {AliasMap} map 
 */
const setConfigObjectsToAliasMap = (object, type, map) => {
	objectForEach(object, (name, data) => {
		const cfg = Config.fromDeclaration(type, name, data);

		map.set(name, {
			type: "config",
			data: cfg
		}, cfg.aliases);
	});
}

setConfigObjectsToAliasMap(userConfigJSON.configs.env, "env", configStores.env);
setConfigObjectsToAliasMap(userConfigJSON.configs.targets, "target", configStores.target);

objectForEach(userConfigJSON.configs.targetGroups, (name, value) => {
	configStores.target.set(name, {
		type: "group",
		data: value
	}, value.aliases);
});

