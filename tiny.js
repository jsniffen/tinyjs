// Find an HTMLElement by id and append another
// HTMLElement to it.
//
// Args:
//  id: A string used to identify the element to append to.
//  component: A function that returns an HTMLElement.
//
// Throws:
//  If no element is found with the provided id
//  an Error is thrown.
export const mount = (id, component) => {
  const container = document.getElementById(id)
  if (container) container.append(component())
  else throw new Error(`element with id: ${id} not found`)
}

// Create an HTMLElement with attributes and children.
//
// Args:
//  type: A string to identify the type of HTML to create.
//  attributes: An object containing properties
//    or attributes to apply to the element.
//  children: One or more HTMLElements to append
//    to the created one.
//
// Returns:
//  The created HTMLElement.
export const element = (type, attributes, ...children) => {
  const element = document.createElement(type)

  for (const key in attributes) {
    const value = attributes[key]
    if (key in element) {
      element[key] = value
    } else {
      element.setAttribute(key, value)
    }
  }
  
  for (const child of children) {
    element.append(child)
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
//    }, div)
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
//
//  Sometimes, it's important that the subscription is scoped
//  to the lifetime of an HTMLElement. In that case, you can
//  optionally provide an HTMLElement as a 2nd argument. If the
//  HTMLElement disconnects from the dom, the subscription
//  is cancelled.
//
//  example: 
//    const div = element("div")
//    onState(state => {
//      div.textContent = state
//    }, div)
//
//  If no HTMLElement is provided, the subscription will last
//  forever.
export const state = (value, name) => {
  const elementListeners = new Map()
  const staticListeners = []

  const clearElementListeners = () => {
    elementListeners.forEach((func, element) => {
      if (element.isConnected) {
        element.wasOnDom = true
      }

      if (!element.isConnected && element.wasOnDom) {
        elementListeners.delete(element)
      }
    })
  }

  const onState = (func, element, defer) => {
    clearElementListeners()

    if (func === null) {
      return value
    }

    if (element) {
      elementListeners.set(element, func)
    } else {
      staticListeners.push(func)
    }

    if (defer) {
      return
    }

    func(value)
  }

  const setState = func => {
    clearElementListeners()

    if (typeof func === "function") {
      value = func(value)
    } else {
      value = func
    }

    elementListeners.forEach(func => func(value))
    staticListeners.forEach(func => func(value))
  }

  return [onState, setState]
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
export const subscribe = (func, onStates, element) => {
  for (const onState of onStates) {
    onState(_ => {
      func(...onStates.map(onState => onState(null)));
    }, element, true);
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
