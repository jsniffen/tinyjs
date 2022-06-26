import { element, mount, route, subscribe, state } from "./../../tiny.js"

const e = element

const header = setItems => {
  const onkeydown = e => {
    if (e.code === "Enter") {
      const item = {
        text: e.target.value,
        completed: false,
      }
      setItems(items => items.concat([item]))
      e.target.value = ""
    }
  }

  return e("header.header",
    e("h1", "todos"),
    e("input.new-todo[autofocus]", {
      placeholder: "What needs to be done?",
      onkeydown: onkeydown,
    })
  )
}

const item = (setItems, item) => {
  const onkeydown =  e => {
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
  }

  const li = e("li", {
    className: item.completed ? "completed" : "",
  })

  const input = (
    e("input.edit", {
      value: item.text,
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
  )

  const view = (
    e("div.view",
      e("input.toggle[type=checkbox]", {
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
      e("label", {
        textContent: item.text,
        ondblclick: () => {
          li.classList.toggle("editing")
          input.focus()
        }
      }),
      e("button.destroy", {
        onclick: () => setItems(items => items.filter(i => i !== item)),
      }),
    )
  )

  li.append(view, input)
  return li
}

const main = (onItems, setItems, onRoute) => {
  const section = e("section.main", {hidden: [items => items.length === 0, onItems]},
    e("input#toggle-all.toggle-all[type=checkbox]", {
      onclick: e => {
        setItems(items => {
          items.forEach(item => item.completed = e.target.checked)
          return items
        })
      }
    }),
    e("label[for=toggle-all]", "Mark all as complete"),
    e("ul.todo-list", [items => items.map(i => item(setItems, i)), onItems]),
  )

    /*
  subscribe((items, route) => {
    if (route === "#/active") {
      items = items.filter(item => !item.completed)
    } else if (route === "#/completed") {
      items = items.filter(item => item.completed)
    }

    let lis = items.map(i => item(setItems, i))

    ul.replaceChildren(...lis)
  }, onItems, onRoute)
  */

  return section
}

const footer = (onItems, setItems, onRoute) => {
  return (
    e("footer.footer", {hidden: [items => items.length === 0, onItems]},
      e("span.todo-count", 
        e("strong", [items => items.filter(i => !i.completed).length, onItems]),
        [items => ` item${items.filter(i => !i.completed).length === 1 ? "" :  "s"} left`, onItems],
      ),
      e("ul.filters",
        e("li",
          e("a", {href: "#/", className: [route => route === "#/" ? "selected" : "", onRoute]}, "All"),
        ),
        e("li",
          e("a", {href: "#/active", className: [route => route === "#/active" ? "selected" : "", onRoute]}, "Active"),
        ),
        e("li",
          e("a", {href: "#/completed", className: [route => route === "#/completed" ? "selected" : "", onRoute]}, "Completed"),
        ),
      ),
      e("button.clear-completed", {onclick: () => setItems(items => items.filter(item => !item.completed))}, "Clear completed")
    )
  )
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
