import React from "react";
import { render } from "react-dom";
import "./index.scss";
import "./tailwind.css";

const ElectronDetails: React.FC = () => (
	<>
		<div className="mb-1">You are running the electron build!</div>
		<ul className="list-disc list-inside">
			<li>Electron Version: {preload_api.getElectronVersion()}</li>
			<li>Chrome Version: {preload_api.getChromeVersion()}</li>
			<li>Node Version: {preload_api.getNodeVersion()}</li>
		</ul>
	</>
);

const App: React.FC = () => {
	return <div className="p-5 bg-gray-200 rounded-xl">
		<h1 className="text-5xl tracking-tight font-bold mb-4">silverstone</h1>
		<div className="mb-4">This app was built with the silverstone framework.</div>
		{__WEB__ ? <div>You are running the web build!</div> : <ElectronDetails />}
	</div>
}

render(
	<App />,
	document.getElementById(__SSTN_REACT_ROOT__)
)