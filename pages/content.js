import { element, mount, state, route, router } from "./tiny.js"

export const sections = [
  {
    id: "tinyjs",
    title: "TinyJS",
    text: "TinyJS is a simple Javascript framework.",
    link: "#/tinyjs",
  },
  {
    id: "elements",
    title: "Elements",
    text: "TinyJS allows you to create elements with the element function.",
    link: "#/elements",
    divId: "my-button",
    code: () => {
      // import { element, mount } from "./tiny.js"
      //
      const myButton = () => {
        return element("button", {
          textContent: "Click me!",
          onclick: () => alert("I've been clicked!"),
        })
      }

      mount("my-button", myButton)
    },
  },
  {
    id: "state",
    title: "State",
    text: "TinyJS has functions for creating and subscribing to state objects.",
    link: "#/state",
    divId: "my-counter",
    code: () => {
      // import { element, mount, state } from "./tiny.js"
      //
      const counter = () => {
        const [onCount, setCount] = state(0)

        const addOne = element("button", {
          textContent: "Add 1",
          onclick: () => setCount(count => count + 1),
        })

        const subtractOne = element("button", {
          textContent: "Subtract 1",
          onclick: () => setCount(count => count - 1),
        })

        const reset = element("button", {
          textContent: "Reset to 0",
          onclick: () => setCount(0),
        })

        const status = element("div")

        onCount(count => {
          status.textContent = `Count: ${count}`
        }, status)

        return element("div", {},
          status,
          addOne,
          subtractOne,
          reset,
        )
      }

      mount("my-counter", counter)
    },
  },
  {
    id: "router",
    title: "Router",
    text: "TinyJS has a built in router that allows you to easily write SPAs.",
    link: "#/router",
    divId: "my-router",
    code: () => {
      // import { element, mount, route, router } from "./tiny.js"
      //
      const myRouter = () => {
        const { onRoute, go } = route()

        const goToA = element("button", {
          textContent: "A",
          onclick: () => go("/tinyjs/#/a/test"),
        })

        const goToB = element("button", {
          textContent: "B",
          onclick: () => go("/tinyjs/#/b"),
        })

        const goToDefault = element("button", {
          textContent: "Default",
          onclick: () => go("/tinyjs/#/"),
        })

        const div = router({
          "/a/:id": args => element("div", {
            textContent: `route a: ${args.id}`
          }),
          "/b": () => element("div", {
            textContent: `route b`
          }),
          "*": () => element("div", {
            textContent: `default route`
          }),
        }, onRoute)

        return element("div", {},
          div,
          goToA,
          goToB,
          goToDefault,
        )
      }

      mount("my-router", myRouter)
    },
  },
]
