export const register = (tag, component, mode) => {
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

const _sub = (func, states) => {
  for (const [onState] of states) {
    onState(_ => {
      return func(states.map(([onState]) => onState(null, true)));
    })
  }
  func(states.map(([onState]) => onState(null, true)));
};

export const element = (type, attributes, ...children) => {
  const element = document.createElement(type);

  if (attributes instanceof HTMLElement || typeof attributes === "function") {
    children = [attributes].concat(children);
  } else {
    for (const key in attributes) {
      const value = attributes[key];

      if (typeof value === "function") {
        const func = value.toString();
        const params = func.substring(0, func.indexOf("="));
        const args = params.replace(/\(|\)|\s/g, "")
          .split(",")
          .filter(arg => arg.length > 0);

        let match = args.length > 0;
        for (const arg of args) {
          if (!(arg in states)) {
            match = false;
            break;
          }
        }

        if (match) {
          _sub(x => {
            element[key] = value(...x);
            return element;
          }, args.map(arg => states[arg]));
          continue;
        }
      }

      if (key in element) {
        element[key] = attributes[key];
      } else {
        element.setAttribute(key, attributes[key]);
      }
    }
  }
  
  for (const child of children) {
    if (typeof child === "function") {
      const func = child.toString();
      const params = func.substring(0, func.indexOf("="));
      const args = params.replace(/\(|\)|\s/g, "")
        .split(",")
        .filter(arg => arg.length > 0);

      let match = true;
      for (const arg of args) {
        if (!(args in states)) {
          match = false;
          break;
        }
      }

      if (match) {
        _sub(x => {
          element.innerHTML = "";
          const e = child(...x);
          if (Array.isArray(e)) {
            element.replaceChildren(...e);
          } else {
            element.replaceChildren(e);
          }
          return element;
        }, args.map(arg => states[arg]));
        continue;
      }
    }

    element.append(child);
  }

  return element;
};

export const style = (css) => {
  return element("style", {textContent: css});
};

const states = {}
export const state = (value, name) => {
  let subscribers = [];

  const onState = (func, get) => {
    if (get) {
      return value;
    }

    subscribers.push(func);
    return func(value);
  }

  const setState = func => {
    if (typeof func === "function") {
      value = func(value);
    } else {
      value = func
    }

    subscribers.forEach(func => func(value))
  }

  states[name] = [onState, setState];
  return states[name];
}

export const subscribe = (func, onStates) => {
  for (const onState of onStates) {
    onState(_ => {
      return func(...onStates.map(onState => onState(null, true)));
    })
  }
  func(...onStates.map(onState => onState(null, true)));
};

/*
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
*/

// export {style, element, state, register, router, which, route, subscribeAll};
