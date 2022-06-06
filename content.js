import { element, state, route, router } from "./tiny.js"

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
    codeName: "myButton",
    code: () => {
      const myButton = () => {
        return element("button", {
          textContent: "Click me!",
          onclick: () => alert("I've been clicked!"),
        })
      }
      return myButton()
    },
  },
  {
    id: "state",
    title: "State",
    text: "TinyJS has functions for creating and subscribing to state objects.",
    link: "#/state",
    code: () => {
      const counter = () => {
        const [onCount, setCount] = state(0)

        const button = element("button", {
          textContent: "Add 1",
          onclick: () => setCount(count => count + 1),
        })

        const div = element("div")
        onCount(count => {
          div.textContent = `Count: ${count}`
        }, div)

        return element("div", {},
          div,
          button
        )
      }

      return counter()
    },
  },
  {
    id: "router",
    title: "Router",
    text: "TinyJS has a built in router that allows you to navigate easily write SPAs.",
    link: "#/router",
    code: () => {
      const myRouter = () => {
        const { onRoute, go } = route()

        const select = element("select", {
          onchange: e => {
            go(e.target.value)
          }
        },
          element("option", {
            textContent: "A",
            value: "/#/a/test",
          }),
          element("option", {
            textContent: "B",
            value: "/#/b",
          }),
          element("option", {
            textContent: "C",
            value: "/#/c",
          }),
        )

        return element("div", {},
          select,
          router({
            "/a/:id": args => element("div", {
              textContent: `route a: ${args.id}`
            }),
            "/b": args => element("div", {
              textContent: `route b`
            }),
            "*": args => element("div", {
              textContent: `default route`
            }),
          }, onRoute),
        )
      }
      return myRouter()
    },
  },
]
