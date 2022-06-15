import { route, style, element, state, register } from "../tiny.js";

register("my-counter", _ => {
  const span = element("span", { textContent: 0 });

  const btn = element("button", {
    style: "margin-left: 5px",
    textContent: "Count",
    onclick: () => {
      span.textContent = parseInt(span.textContent) + 1;
    },
  });

  return element("div", {},
    element("p", { textContent: "Counter" }),
    span,
    btn
  );
});
