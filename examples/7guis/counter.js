import { element, mount } from "../../tiny.js"

mount("my-counter", () => {
  const span = element("span", { textContent: 0 })

  const btn = element("button", {
    style: "margin-left: 5px",
    textContent: "Count",
    onclick: () => {
      span.textContent = parseInt(span.textContent) + 1
    },
  })

  return element("div", {},
    element("p", { textContent: "Counter" }),
    span,
    btn
  )
})
