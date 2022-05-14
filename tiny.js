const register = (tag, component) => {
	class InputElement extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({mode: "open"});
			this.shadowRoot.append(component());
		}
	};

	window.customElements.define(tag, InputElement);
};

const element = (type, attributes) => {
	const element = document.createElement(type);
	for (const key in attributes) {
		element[key] = attributes[key];
	}
	return element;
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
