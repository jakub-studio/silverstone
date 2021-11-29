/*

You can add your own app types in this file.
You do not need to keep the 'PreloadApi' example code.

*/

/* Example API, as defined in src/preload/index.ts */
interface PreloadApi {
	getNodeVersion(): string;
	getChromeVersion(): string;
	getElectronVersion(): string;
}

declare var preload_api: PreloadApi;

/*
It is recommended not to remove the following module declarations.
*/
declare module "silverstone/electron/main" {
	const bind: () => void;
	export default bind;
}

/*

!!! WARNING! READ BEFORE EDITING / DELETING !!!
The declarations below are used by silverstone framework and are neccessary in order for your app to
pass type checks. If you remove them your typescript check will fail as the global variables introduced
by silverstone will no longer be declared.

If you wish to change the names of the variables, you must change them here and in the configs were they
are defined. Otherwise, you should leave this file alone unless you know exactly what you are doing.

*/

/* Files ending with .include (e.g. 'helloworld.txt.include') will be included with raw-loader */
declare module '*.include' {
    const content: string;
    export default content;
}

/**
 * Boolean represting whether this is a development build or not. Available in all configs. Will be transformed to a boolean by Webpack DefinePlugin
 * @example // Development Build
 * __DEV__: true
 * // Production Build
 * __DEV__: false
 * @global
 * @constant
 */
declare var __DEV__: boolean;
/**
 * Boolean represting whether this is a web build or not. **Available only in the renderer process**. Will be transformed to a boolean by Webpack DefinePlugin
 * @example // Web Build
 * __WEB__: true
 * // App (electron) Build
 * __WEB__: false
 * @global
 * @constant
 */
declare var __WEB__: boolean;

/**
 * ID of the react root container element. **Available only in the renderer process**
 * @global
 * @constant
 * @private
 */
declare var __SSTN_REACT_ROOT__: string;

declare var __SSTN_FILENAME_RENDERER_MOUNT__: string;

declare var __SSTN_FILENAME_PRELOAD__: string;