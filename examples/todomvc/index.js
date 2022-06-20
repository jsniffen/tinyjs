import { element, mount, route, subscribe, state } from "./../../tiny.js"

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
  const li = element("li", { className: item.completed ? "completed" : "", })

  const input = element("input", {
    className: "edit", value: item.text,
    onkeydown: e => {
      if (e.code === "Enter") {
        setItems(items => {
          if (e.target.value != "") {
            items.forEach(i => {
              if (i === item) {
                item.text = e.target.value
                return items
              }
            })
          } else {
            items.filter(i => item !== i)
          }
          return items
        })
        li.classList.toggle("editing")
      }
    },
  })

  const view = element("div", { className: "view" },
    element("input", {
      className: "toggle",
      type: "checkbox",
      checked: item.completed,
      onclick: e => {
        setItems(items => {
          for (let i = 0; i < items.length; i++) {
            if (items[i] === item) {
              items[i].completed = !items[i].completed
              return items
            }
          }
        })
      }
    }),
    element("label", {
      textContent: item.text,
      ondblclick: () => {
        li.classList.toggle("editing")
        input.focus()
      }
    }),
    element("button", {
      className: "destroy",
      onclick: () => setItems(items => items.filter(i => i !== item)),
    }),
  )

  li.append(view, input)
  return li
}

const main = (onItems, setItems, onRoute) => {
  const ul = element("ul", { className: "todo-list" })

  const section = element("section", { className: "main" },
    element("input", {
      className: "toggle-all",
      id: "toggle-all",
      type: "checkbox",
      onclick: e => {
        setItems(items => {
          items.forEach(item => item.completed= e.target.checked)
          return items
        })
      }
    }),
    element("label", {
      for: "toggle-all",
      textContent: "Mark all as complete",
    }),
    ul,
  )

  subscribe((items, route) => {
    section.hidden = items.length === 0

    if (route === "#/active") {
      items = items.filter(item => !item.completed)
    } else if (route === "#/completed") {
      items = items.filter(item => item.completed)
    }

    let lis = items.map(i => item(setItems, i))

    ul.replaceChildren(...lis)
  }, onItems, onRoute)

  return section
}

const footer = (onItems, setItems, onRoute) => {
  const span = element("span", { className: "todo-count" })

  const all = element("a", {
    href: "#/",
    textContent: "All",
  })

  const active = element("a", {
    href: "#/active",
    textContent: "Active",
  })

  const completed = element("a", {
    href: "#/completed",
    textContent: "Completed",
  })

  onRoute(route => {
    active.classList.remove("selected")
    all.classList.remove("selected")
    completed.classList.remove("selected")
    if (route === "#/active")  {
      active.classList.add("selected")
    } else if (route === "#/completed") {
      completed.classList.add("selected")
    } else {
      all.classList.add("selected")
    }
  })

  const footer = element("footer", { className: "footer" },
    span,
    element("ul", { className: "filters" },
      element("li", {}, all),
      element("li", {}, active),
      element("li", {}, completed),
    ),
    element("button", {
      className: "clear-completed",
      textContent: "Clear completed",
      onclick: () => setItems(items => items.filter(item => !item.completed)),
    }),
  )

  onItems(items => {
    footer.hidden = items.length === 0
    const count = items.filter(item => !item.completed).length
    if (count > 0 && count < 10 ) {
      span.innerHTML = `<strong>${count}</strong> item left`
    } else {
      span.innerHTML = `<strong>${count}</strong> items left`
    }
  })

  return footer
}

mount("tiny-todomvc", () => {
  const items = "tiny-todomvc" in localStorage ? JSON.parse(localStorage["tiny-todomvc"]) : []
  const [onItems, setItems] = state(items)

  onItems(items => {
    localStorage["tiny-todomvc"] = JSON.stringify(items)
  })

  const { onRoute } = route()

  return [
    header(setItems),
    main(onItems, setItems, onRoute),
    footer(onItems, setItems, onRoute),
  ]
})
