import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("preload_api", {
	getNodeVersion (): string {
		return process.versions.node;
	},
	getChromeVersion (): string {
		return process.versions.chrome;
	},
	getElectronVersion (): string {
		return process.versions.electron;
	}
});