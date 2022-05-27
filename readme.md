<p align="center">
  <b role="heading" aria-level="1">silverstone</b>
  <br>
  Highly customisable Electron boilerplate and CLI tool utilising concurrent builds featuring React, Typescript, TailwindCSS and others.
  <br><br>
  <a href="https://github.com/jakuski/silverstone"><img src="https://badgen.net/badge/icon/CLI%20Tool?icon=terminal&label"></a>
</p>

<br>

## What is silverstone?
---
Concurrent webpack script runner


## Technologies featured:
---
- React
- Electron
- TypeScript
- TailwindCSS
- Webpack
- Babel
- PostCSS

## Installation
----

To use silverstone on a new project. Simply fork this repository and download it to your machine.

```
npm i --production=false
```

The `--production-false` argument must be present in order to install `devDependencies` listed in `package.json`.

## Usage
---
Build

```
npx sstn build <env-config> <target-configs?>
```
example
```
npx sstn build development electron-main,electron-renderer
```

## Configuration
---
By default the `config.json` as a group named `DEFAULT` which allows for ommision of the `target-configs` in the `build` command. e.g.

```json
{
	"groups": {
		"DEFAULT": {
			"configs": ["electron-main","electron-preload","electron-renderer"]
		}
	}
}
```
```
npx sstn build development
```
will build the `electron-main`, `electron-preload`, and `electron-renderer` with the `development` configuration merged.

### Default Configs

blah blah
