const register = (tag, component, mode) => {
  class CustomElement extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.attachShadow({mode: mode ? mode : "open"});
      this.shadowRoot.append(component(this));
    }
  };

  window.customElements.define(tag, CustomElement);
};

const element = (type, attributes, ...children) => {
  const element = document.createElement(type);

  for (const key in attributes) {
    if (key in element) {
      element[key] = attributes[key];
    } else {
      element.setAttribute(key, attributes[key]);
    }
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

const newState = initialValue => {
  const st = state(initialValue);
  // const update = (updater) => {
    // st.set(updater(st.get()));
  // };
  return [st.subscribe, null];
}

const router = routes => {
  const container = element("div");

  route.subscribe(path => {
    container.innerHTML = "";

    const pathParts = path.split("/");

    for (const route in routes) {
      const routeParts = route.split("/");

      if (routeParts[0] === "_") {
        container.append(routes[route]());
        return;
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
        container.append(routes[route](args));
        return;
      }
    }
  });

  return container;
};

const which = (state, e1, e2) => {
  state.subscribe(which => {
    e1.hidden = !which;
    e2.hidden = which;
  });

  return element("div", {}, e1, e2);
};

const route = {
  ...state(window.location.pathname),
  go: function(path) {
    window.history.pushState({}, "", path);
    this.set(path);
  },
  back: function() {
    window.history.back();
  },
  forward: function() {
    window.history.forward();
  },
};
window.addEventListener("popstate", () => route.set(window.location.pathname));

export {newState, style, element, state, register, router, which, route};
