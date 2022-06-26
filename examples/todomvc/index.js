import {element, mount, state} from "./../../tiny.js"

const e = element

const [onItems, setItems, $items] = state([])

const item = item => {
  return e("div", item)
}

mount("tiny-todomvc", () => {
  return [
    e("header.header",
      e("h1.todos"),
      e("input.new-todo[autofocus][placeholder='What needs to be done?']", {
        onchange: e => setItems(items => items.concat([e.target.value]))
      }),
    ),
    e("section.main",
      e("input#toggle-all.toggle-all[type=checkbox]"),
      e("label[for='toggle-all']", "Mark all as complete"),
      e("ul.todo-list", $items(items => items.map(item)), "END"), 
    ),
    e("footer.footer",
      e("span.todo-count", "asd"),
      e("ul.filters",
        e("li", e("a[href='/#']", "All")),
        e("li", e("a[href='/#/active']", "Active")),
        e("li", e("a[href='/#/completed']", "Completed")),
      ),
      e("button.clear-completed", "Clear Completed"),
    )
  ]
})
