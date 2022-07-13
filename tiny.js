export const element = (str, ...args) => {
  let [type, id, classes, attributes] = ["", "", [], {}]
  while (true) {
    let start = str.lastIndexOf("[")
    let end = str.lastIndexOf("]")
    if (start !== -1 && end !== -1) {
      const selector = str.slice(start+1, end)
      let [key, value] = selector.split("=")
      value = value ?? true
      if (value[0] === "'" || value[0] === "\"") {
        value = value.slice(1, -1)
      }
      attributes[key] = value
      str = str.slice(0, start)
      continue
    } 

    start = str.lastIndexOf(".")
    if (start != -1) {
      classes.push(str.slice(start+1))
      str = str.slice(0, start)
      continue
    }

    start = str.lastIndexOf("#")
    if (start != -1) {
      id = str.slice(start+1)
      str = str.slice(0, start)
      continue
    }

    type = str
    break
  }

  const element = document.createElement(type)
  if (id) element.id = id
  element.classList.add(...classes)
  for (const key in attributes) {
    const value = attributes[key]
    element.setAttribute(key, value)
  }

  for (const arg of args) {
    if (arg instanceof HTMLElement ||
               typeof(arg) === "string" ||
               typeof(arg) === "number") {
      element.append(arg)
    } else if (typeof(arg) === "object"){
      for (const key in arg) {
        const value = arg[key]
        if (key === "ref") {
          if (typeof(value) === "object" &&
              "element" in value) {
            value.element = element
          } else {
            throw new Error("Invalid reference")
          }
        } else{
          if (key in element) {
            element[key] = value
          } else {
            element.setAttribute(key, value)
          }
        }
      }
    }
  }

  return element
}

export const mount = (id, component) => {
  const container = document.getElementById(id)
  if (container) {
    const elements = component()
    if (Array.isArray(elements)) container.append(...elements)
    else container.append(elements)
  } else {
    throw new Error(`element with id: ${id} not found`)
  }
}

export const onMany = (func, ...onStates) => {
  for (const onState of onStates) {
    onState(_ => {
      func(...onStates.map(onState => onState()));
    }, true);
  }
  func(...onStates.map(onState => onState()));
};

export const ref = () => {
  return {element: null}
}

export const state = (value, name) => {
  const listeners = []

  const onState = (func, defer) => {
    if (!func) {
      return value
    }
    listeners.push(func)
    if (!defer) {
      func(value)
    }
  }

  const setState = func => {
    const result = typeof func === "function" ? func(value) : func
    if (result !== undefined) value = result
    listeners.forEach(func => func(value))
  }

  return [onState, setState]
}

const [onRoute, setRoute] = state(window.location.hash);

export const route = () => {

  window.addEventListener("popstate", () => {
    setRoute(window.location.hash);
  });

  const go = path => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  const back = () => {
    window.history.back();
  };

  const forward = () => {
    window.history.forward();
  };

  return {onRoute, go, back, forward}
}

export const router = routes => {
  const container = element("div");

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

export const test = (name, func) => {
  const start = performance.now()
  let error = null
  try {
    func(msg => { throw new Error(msg) })
  } catch (e) {
    error = e
  }
  const time = ((performance.now() - start)/1000).toFixed(2)
  const status = error === null ? "✓" : "✗"
  console.log(`${status} ${name} (${time}s)`)
  if (error) console.log(error)
  return {name, error, time, status}
}
