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

const route = routes => {
  const pathParts = window.location.pathname.split("/");

  for (const route in routes) {
    const routeParts = route.split("/");

    if (routeParts[0] === "_") {
      return routes[route]();
    }
    
    if (pathParts.length !== routeParts.length) continue;

    const args = {};

    let match = true;
    for (let i = 1; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      if (routePart.length == 0) break;

      if (routePart[0] == ":") {
        args[routePart.substring(1, routePart.length)] = pathParts[i];
      } else if (routeParts[i] !== pathParts[i]) {
        match = false;
        break;
      }
    }

    if (match) {
      return routes[route](args);
    }
  }

  return null;
};
