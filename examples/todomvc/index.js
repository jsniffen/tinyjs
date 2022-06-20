import { element, mount, state } from "./../../tiny.js"

const header = setItems => {
  return element("header", { className: "header" },
    element("h1", { textContent: "todos" }),
    element("input", {
      className: "new-todo",
      placeholder: "What needs to be done?",
      autofocus: true,
      onkeydown: e => {
        if (e.code === "Enter") {
          const item = {
            text: e.target.value,
            completed: false,
          }
          setItems(items => items.concat([item]))
          e.target.value = ""
        }
      }
    }),
  )
}

const item = (setItems, item) => {
  return element("li", {
      className: item.completed ? "completed" : "",
    },
    element("div", { className: "view" },
      element("input", {
        className: "toggle",
        type: "checkbox",
        checked: item.completed,
        onclick: e => {
          setItems(items => {
            for (let i = 0; i < items.length; i++) {
              if (items[i].text === item.text) {
                items[i].completed = !items[i].completed
                return items
              }
            }
          })
        }
      }),
      element("label", { textContent: item.text }),
      element("button", {
        className: "destroy",
        onclick: () => setItems(items => items.filter(i => i.text !== item.text)),
      }),
    )
  )
}

const main = (onItems, setItems) => {
  const ul = element("ul", { className: "todo-list" })

  onItems(items => {
    console.log(items)
    const lis = items.map(i => item(setItems, i))
    ul.replaceChildren(...lis)
  })

  return element("section", { className: "main" },
    element("input", {
      className: "toggle-all",
      id: "toggle-all",
      type: "checkbox",
    }),
    element("label", {
      for: "toggle-all",
      textContent: "Mark all as complete",
    }),
    ul,
  )
}

const footer = (onItems) => {
  const span = element("span", { className: "todo-count" })
  onItems(items => {
    const count = items.filter(item => !item.completed).length
    if (count > 0 && count < 10 ) {
      span.innerHTML = `<strong>${count}</strong> item left`
    } else {
      span.innerHTML = `<strong>${count}</strong> items left`
    }
  })

  return element("footer", { className: "footer" },
    span,
    element("ul", { className: "filters" },
      element("li", {},
        element("a", {
          className: "selected",
          href: "#/",
          textContent: "All",
        }),
      ),
      element("li", {},
        element("a", {
          href: "#/active",
          textContent: "Active",
        }),
      ),
      element("li", {},
        element("a", {
          href: "#/completed",
          textContent: "Completed",
        }),
      ),
    ),
    element("button", {
      className: "clear-completed",
      textContent: "Clear completed",
    }),
  )
}

mount("tiny-todomvc", () => {
  const [onItems, setItems] = state([])

  return [
    header(setItems),
    main(onItems, setItems),
    footer(onItems),
  ]
})
