import { element, mount, state } from "./../../tiny.js"

const [onItems, setItems] = state([
  { text: "clean my room", done: false },
  { text: "do my homework", done: false },
  { text: "write unit tests", done: false },
])

const header = () => {
  const toggleDone = element("button", {
    textContent: "toggle",
    onclick: () => {
      setItems(items => {
        let allDone = true

        for (const item of items) {
          if (!item.done) {
            allDone = false
            break
          }
        }

        return items.map(item => {
          item.done = !allDone
          return item
        })
      })
    }
  })

  const input = element("input", {
    onkeydown: e => {
      if (e.code === "Enter") {
        setItems(items => items.concat([{
          text: e.target.value,
          done: false,
        }]))
      }
    }
  })

  return element("div", {},
    toggleDone,
    input,
  )
}

const list = () => {
  const div = element("div")

  onItems(items => {
    const rows = items.map(listRow)
    div.replaceChildren(...rows)
  })

  return div
}

const listRow = ({ text, done }) => {
  const [onHover, setHover] = state(false)

  const span = element("span", {
    textContent: text,
    className: `list-row ${done ? "list-row--done" : ""}`,
  })

  const toggleDoneButton = element("button", {
    textContent: done ? "incomplete" : "complete",
    onclick: () => {
      setItems(items => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].text === text) {
            items[i].done = !items[i].done
            break
          }
        }
        return items
      })
    },
  })

  const deleteButton = element("button", {
    textContent: "delete",
    onclick: () => {
      setItems(items => {
        return items.filter(item => item.text !== text)
      })
    }
  })

  onHover(hover => deleteButton.hidden = !hover)

  return element("div", {
    onmouseenter: () => setHover(true),
    onmouseleave: () => setHover(false),
  },
    toggleDoneButton,
    span,
    deleteButton,
  )
}

const footer = () => {
  const itemsRemaining = element("span")

  const clearCompleted = element("button", {
    textContent: "Clear completed",
    onclick: () => setItems(items => items.filter(item => !item.done)),
  })

  onItems(items => {
    const remaining = items.filter(item => !item.done).length
    itemsRemaining.textContent = `${remaining} items left`
    clearCompleted.hidden = remaining === items.length
  })

  return element("div", {},
    itemsRemaining,
    clearCompleted,
  )
}

mount("tiny-todo", () => {
  return element("div", { className: "card" },
    header(),
    list(),
    footer(),
  )
})
