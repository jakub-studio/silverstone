const StickyLine = module.exports.StickyLine = class StickyLine {
	constructor () {
		/**
		 * @type {string}
		 */
		this._lastLineOutput = null;
	}
	start (initialContent) {
		this._lastLineOutput = initialContent;
		this._write(initialContent);
	}
	stop () {
		this._write("\n");
	}
	updateLineContent (content) {
		this._lastLineOutput = content;
		this._clearLine();
		this._write(content);
	}
	logAbove (content) {
		this._clearLine();
		this._write(content, true);
		this._write(this._lastLineOutput);
	}
	_clearLine () {
		const contentWipeStr = Array((process.stdout.columns || this._lastLineOutput.length) + 1).join(" ");
		this._resetCursor();
		this._write(contentWipeStr);
		this._resetCursor();
	}
	_write (content, newLine) {
		process.stdout.write(content + (newLine ? "\n" : ""));
	}
	_resetCursor () {
		process.stdout.cursorTo(0);
	}
}