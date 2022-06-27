class $ {
  constructor(func, on) {
    this.func = func
    this.on = on
  }
}

const watch = (element, on, func) => {
  let created = [document.createTextNode("")]
  element.append(created[0])

  on(s => {
    let nodes = func(s)
    if (!nodes) nodes = ""
    nodes = Array.isArray(nodes) ? nodes : [nodes]
    nodes = nodes.map(node => node instanceof HTMLElement
      ? node
      : document.createTextNode(node))

    for (let i = 0; i < Math.min(nodes.length, created.length); i++) {
      if (!created[i].isEqualNode(nodes[i])) {
        console.log("replacing", i)
        created[i].replaceWith(nodes[i])
        created[i] = nodes[i]
      }
    }

    if (nodes.length > created.length) {
      const newNodes = nodes.slice(created.length)
      created[created.length-1].after(...newNodes)
      created = created.concat(newNodes)
    } else {
      created.slice(nodes.length).forEach(n => n.remove())
      created = created.slice(0, nodes.length)
    }
  })
}

const setAttribute = (element, key, value) => {
  if (key in element) {
    element[key] = value
  } else {
    element.setAttribute(key, value)
  }
}

export const parseCSSSelector = str => {
  let [id, classes, attrs] = ["", [], {}]
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
      attrs[key] = value
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

    return [str, id, classes, attrs]
  }
}

export const mount = (id, component) => {
  const container = document.getElementById(id)
  if (container) {
    const elements = component()
    if (Array.isArray(elements)) container.append(...elements)
    else container.append(elements)
  }
  else throw new Error(`element with id: ${id} not found`)
}

export const element = (str, ...args) => {
  const [type, id, classes, attrs] = parseCSSSelector(str)
  const element = document.createElement(type)
  if (id) element.id = id
  element.classList.add(...classes)
  for (const key in attrs) {
    const value = attrs[key]
    setAttribute(element, key, value)
  }

  for (const arg of args) {
    if (arg instanceof $) {
      watch(element, arg.on, arg.func)
    } else if (arg instanceof HTMLElement ||
               typeof(arg) === "string" ||
               typeof(arg) === "number") {
      element.append(arg)
    } else {
      Object.entries(arg).forEach(([key, value]) => {
        if (value instanceof $) {
          value.on(s => {
            setAttribute(element, key, value.func(s))
          })
        } else {
          setAttribute(element, key, value)
        }
      })
    }
  }

  return element
}

// Create a value that can be subscribed to when
// it changes.
//
// Args:
//  value: The initial value of the state.
//  name: An optional name for the state, used for
//    debugging only.
//
// Returns:
//  A list of two functions: [setState, onState]
//
//  example:
//    const [onCount, setCount] = state(0) 
//
//    const div = element("div")
//
//    onCount(count => {
//      div.textContent = count
//    })
//
//  setState is a function that can be called
//  to modify the state and broadcast the
//  changes to all subscribers.
//
//  setState can be called with a function or a value.
//
//  If it is called with a function, the function
//  will be provided the current value of the state.
//  example:
//    setState(count => count+1)
//
//  If it is called with a value, the state will be set
//  to the provided value.
//  example:
//    setState(2)
//
//  onState is a function that can be called to 
//  subscribe to any state changes. onState is called
//  by passing in a callback function that will run
//  anytime the state is updated.
//
//  example:
//    onState(state => console.log(state))
export const state = (value, name) => {
  const listeners = []

  const onState = (func, defer) => {
    if (func === null) {
      return value
    }
    listeners.push(func)
    if (!defer) {
      func(value)
    }
  }

  const setState = func => {
    if (typeof func === "function") {
      value = func(value)
    } else {
      value = func
    }
    listeners.forEach(func => func(value))
  }


  const $state = func => {
    return new $(func, onState)
  }

  return [onState, setState, $state]
}

// Subscribe to multiple states at once.
//
// Args:
//  func: A callback function to run when any
//    of the states change.
//  onStates: One or more states to subscribe to.
//  element: An HTMLElement to scope the subscriptions to.
//    When the element disconnects from the dom, all
//    subscriptions will be cancelled. Otherwise, they are
//    permanent.
//
//  Example:
//    const [onCount, setCount] = state(0)
//    const [onLoading, setLoading] = state(false)
//
//    const div = element("div")
//
//    subscribe((count, loading) => {
//      div.textContent = count
//      div.hidden = !loading
//    }, [onCount, onLoading], div)
export const subscribe = (func, ...onStates) => {
  for (const onState of onStates) {
    onState(_ => {
      func(...onStates.map(onState => onState(null)));
    }, true);
  }
  func(...onStates.map(onState => onState(null)));
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
}
