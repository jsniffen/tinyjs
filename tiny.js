export const mount = (id, component) => {
  const container = document.getElementById(id)
  if (container) container.append(component())
}

export const element = (type, attributes, ...children) => {
  const element = document.createElement(type);

  for (const key in attributes) {
    const value = attributes[key];
    if (key in element) {
      element[key] = value;
    } else {
      element.setAttribute(key, value);
    }
  }
  
  for (const child of children) {
    element.append(child);
  }

  return element;
};

export const state = (value, name) => {
  const elementListeners = new Map();
  const staticListeners = [];

  const clearElementListeners = () => {
    elementListeners.forEach((func, element) => {
      if (element.isConnected) {
        element.wasOnDom = true;
      }

      if (!element.isConnected && element.wasOnDom) {
        elementListeners.delete(element);
      }
    });
  }

  const onState = (func, element, mode) => {
    clearElementListeners();

    if (mode === "GET") {
      return value;
    }

    if (element) {
      elementListeners.set(element, func);
    } else {
      staticListeners.push(func);
    }

    if (mode === "DEFER") {
      return;
    }

    func(value);
  }

  const setState = func => {
    clearElementListeners();

    if (typeof func === "function") {
      value = func(value);
    } else {
      value = func
    }

    elementListeners.forEach(func => func(value))
    staticListeners.forEach(func => func(value))
  }

  return [onState, setState];
}

export const subscribe = (func, onStates, element) => {
  for (const onState of onStates) {
    onState(_ => {
      func(...onStates.map(onState => onState(null, null, "GET")));
    }, element, "DEFER");
  }
  func(...onStates.map(onState => onState(null, null, "GET")));
};

export const route = () => {
  const [onRoute, setRoute] = state(window.location.hash);

  window.addEventListener("popstate", () => {
    setRoute(window.location.hash);
  });

  const go = path => {
    window.location = path;
  };

  const pushState = path => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  const back = () => {
    window.history.back();
  };

  const forward = () => {
    window.history.forward();
  };

  return {
    onRoute, setRoute, go, pushState, back, forward,
  };
};

export const router = (routes, onRoute) => {
  const container = element("div");

  if (!onRoute) {
    onRoute = route().onRoute
  }

  onRoute(path => {
    const pathParts = path.split("/")
      .filter(part => part !== "" && part !== "#");

    for (const route in routes) {
      const routeParts = route.split("/")
        .filter(part => part !== "" && part !== "#");

      if (routeParts[0] === "*") {
        container.replaceChildren(routes[route]());
        return;
      }

      if (pathParts.length !== routeParts.length) continue;

      const args = {};

      let match = true;
      for (let i = 0; i < routeParts.length; i++) {
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
        container.replaceChildren(routes[route](args));
        return;
      }
    }
  });

  return container;
};

export const test = (name, fn, cb) => {
  const errs = []
  console.log("=== RUN", name)
  const start = performance.now()
  let end = start;
  try {
    fn(msg => {throw new Error(msg)})
  } catch (err) {
    errs.push(err)
  } finally {
    end = performance.now()
  }
  const status = errs.length === 0 ? "PASS" : "FAIL"
  const time = (end-start).toFixed(2)
  console.log(`--- ${status} (${time}s)`)
  errs.forEach(err => console.log(err))
  if (cb) cb([name, errs, time])
}
