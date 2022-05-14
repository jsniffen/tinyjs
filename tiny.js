const register = (tag, component, mode) => {
	class CustomElement extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({mode: mode ? mode : "open"});
			this.shadowRoot.append(component(this));
		}
	};

	window.customElements.define(tag, CustomElement);
};

const element = (type, attributes, ...children) => {
	const element = document.createElement(type);

	for (const key in attributes) {
		element[key] = attributes[key];
	}

	for (const child of children) {
		element.append(child);
	}

	return element;
};

const style = (css) => {
	return element("style", {textContent: css});
};

const state = initialValue => ({
	value: initialValue,
	get: function() {
		return this.value;
	},
	set: function(newValue) {
		this.value = newValue;
		this.listeners.forEach(fn => fn(newValue));
	},
	subscribe: function(fn) {
		fn(this.value);
		this.listeners.push(fn);
	},
	listeners: [],
});
