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