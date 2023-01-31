import {element as e, mount, ref, state, route, onMany} from "./../../tiny.js"

const items = "tiny-todomvc" in localStorage ? JSON.parse(localStorage["tiny-todomvc"]) : []
const [onItems, setItems] = state(items)
onItems(items => {
  localStorage["tiny-todomvc"] = JSON.stringify(items)
});

const [onShowing, setShowing] = state(window.location.hash);
window.addEventListener("popstate", () => {
  setShowing(window.location.hash);
});

const createItem = text => {
  setItems(items => items.concat([{done: false, text}]))
}

const deleteDoneItems = () => {
  setItems(items => items.filter(item => !item.done))
}

const deleteItem = item => {
  setItems(items => items.filter(i => i !== item))
}

const toggleAllDone = e => {
  setItems(items => items.forEach(item => item.done = e.target.checked))
}

const toggleItemDone = item => {
  setItems(items => items.forEach(i => {
    if (i === item) i.done = !i.done
  }))
}

const updateItemText = (item, text) => {
  setItems(items => items.forEach(i => {
    if (i === item) {
      i.text = text
    }
  }))
}

const item = item => {
  const input = ref()
  const li = ref()

  return (
    e("li", {ref: li, className: item.done ? "completed" : ""},
      e("div.view",
        e("input.toggle[type='checkbox']", {checked: item.done, onclick: () => toggleItemDone(item)}),
        e("label", {
          ondblclick: () => {
            li.element.classList.toggle("editing")
            input.element.focus()
          }
        }, item.text),
        e("button.destroy", {onclick: () => deleteItem(item)}),
      ),
      e("input.edit", {
        ref: input,
        value: item.text,
        onchange: e => updateItemText(item, e.target.value),
        onblur: () => li.element.classList.toggle("editing"),
      })
    )
  )
}

mount("tiny-todomvc", () => {
  const [todoCount, todoList] = [ref(), ref()]
  const [all, active, completed] = [ref(), ref(), ref()]

  const html = [
    e("header.header",
      e("h1.todos", "todos"),
      e("input.new-todo[autofocus][placeholder='What needs to be done?']", {
        onchange: e => {
          createItem(e.target.value)
          e.target.value = ""
        }
      }),
    ),
    e("section.main",
      e("input#toggle-all.toggle-all[type=checkbox]", {onclick: toggleAllDone}),
      e("label[for='toggle-all']", "Mark all as complete"),
      e("ul.todo-list", {ref: todoList}),
    ),
    e("footer.footer",
      e("span.todo-count", {ref: todoCount}),
      e("ul.filters",
        e("li", e("a[href='#/']", {ref: all}, "All")),
        e("li", e("a[href='#/active']", {ref: active}, "Active")),
        e("li", e("a[href='#/completed']", {ref: completed}, "Completed")),
      ),
      e("button.clear-completed", {onclick: deleteDoneItems}, "Clear Completed"),
    )
  ]

  onItems(items => {
    const count = items.filter(item => !item.done).length
    todoCount?.element?.replaceChildren(
      e("strong", count),
      ` ${count === 1 ? "item" : "items"} left`,
    )
  })

  onShowing(showing => {
    [all, active, completed].forEach(n => n?.element?.classList?.remove("selected"))
    if (showing === "#/active") {
      active?.element?.classList.add("selected")
    } else if (showing === "#/completed") {
      completed?.element?.classList.add("selected")
    } else {
      all?.element?.classList.add("selected")
    }
  });

  onMany((items, showing) => {
    if (showing === "#/active") {
      items = items.filter(item => !item.done)
    } else if (showing === "#/completed") {
      items = items.filter(item => item.done)
    }
    todoList?.element?.replaceChildren(...items.map(item))
  }, onItems, onShowing)

  return html
})
