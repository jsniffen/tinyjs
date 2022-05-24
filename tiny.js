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
  _subscribe: function(fn) {
    this.listeners.push(fn);
  },
  listeners: [],
});

const subscribeAll = (func, states) => {
  for (const state of states) {
    state._subscribe(_ => {
      func(states.map(state => state.get()));
    });
  }
  func(states.map(state => state.get()));
};

const router = routes => {
  const container = element("div");

  route.subscribe(path => {
    container.innerHTML = "";

    const pathParts = path.split("/")
      .filter(part => part !== "" && part !== "#");


    for (const route in routes) {
      const routeParts = route.split("/")
        .filter(part => part !== "" && part !== "#");

      if (routeParts[0] === "*") {
        container.append(routes[route]());
        return;
      }

      if (pathParts.length !== routeParts.length) continue;

      const args = {};

      let match = true;
      for (let i = 1; i < routeParts.length; i++) {
        const routePart = routeParts[i];
        if (routePart.length == 0) break;

        if (routePart[0] == "*") {
          continue
        } else if (routePart[0] == ":") {
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
  ...state(window.location.hash || window.location.pathname),
  go: function(path) {
    window.location = path;
  },
  pushState: function(path) {
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

export {style, element, state, register, router, which, route, subscribeAll};
