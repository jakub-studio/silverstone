const { greenBright, redBright, yellowBright } = require("chalk");
const { plural, is, getNextArrayIndex } = require("../utils");

const Animatable = module.exports.Animatable = class Animatable {
	static get Template () {
		return AnimatableTemplate;
	}
	/**
	 * @todo JSDOC
	 * @param {AnimatableTemplate} template 
	 * @param {} stickyLine
	 * @returns {Animatable}
	 */
	static useWithStickyLine (template, stickyLine) {
		let firstCBCalled = false;
	
		const instance = template.use(content => {
			if (firstCBCalled) {
				stickyLine.updateLineContent(content);
			} else {
				stickyLine.start(content);
				firstCBCalled = true;
			}
		});
		return instance;
	}
	constructor (elements, options, onRender) {
		this.elements = elements;
		this.options = options;
		this.props = Object.assign({}, options.defaultProps);
		this.onRender = onRender;

		this._interval = null;
		this._renderCache = this.prepareInitialRenderCache();
	}
	prepareInitialRenderCache () {
		const cache = {};
		for (const [index, el] of this.elements.entries()) {
			if (!Array.isArray(el)) continue;

			cache[index] = -1;
		}
		return cache;
	}
	start () {
		const content = this.dispatchIntervalUpdate();
		this._interval = setInterval(animatable => animatable.dispatchIntervalUpdate(), this.options.interval, this);
		return content;
	}
	stop () {
		clearInterval(this._interval);
	}
	setProps (newProps) {
		Object.assign(this.props, newProps);
		this.dispatchPropUpdate();
	}
	setProp (propName, value) {
		this.props[propName] = value;
		this.dispatchPropUpdate();
	}
	incrementProp (propName) {
		++this.props[propName];
		this.dispatchPropUpdate();
	}
	dispatchPropUpdate () {
		this.render("prop");
	}
	dispatchIntervalUpdate () {
		this.render("interval");
	}
	/**
	 * 
	 * @param {"prop"|"interval"} reason 
	 */
	render (reason) {
		let renderStr = "";
		for (const [index, element] of this.elements.entries()) {
			if (!element) continue;
			const elementTypeof = (Array.isArray(element) && "array") || typeof element;
			switch (elementTypeof) {
				case "string":
					renderStr += element;
					continue;
				case "function":
					renderStr += element(this.props);
					continue;
				case "array":
					if (reason === "prop") {
						renderStr += element[this._renderCache[index]];
					} else {
						const nextFrameIndex = this._renderCache[index] = getNextArrayIndex(element, this._renderCache[index]);
						renderStr += element[nextFrameIndex];
					}
					continue;
				default: continue;
			}
		}
		this.onRender(renderStr);
		return renderStr;
	}
}

class AnimatableTemplate {
	constructor (frames, options) {
		this.frames = frames;
		this.options = options;
	}
	use (onRender) {
		return new Animatable(this.frames, this.options, onRender);
	}
}