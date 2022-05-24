import { container, element, register, route, router, state, subscribe } from "./tiny.js";

const counter = onCount => {
  const div = element("div");

  onCount(count => div.textContent = count);

  return div;
};

const add = (onAdder, setCount, setHistory) => {
  const button =  element("button");

  onAdder(adder => {
    button.textContent = `Add ${adder}`;
    button.onclick = () => {
      setCount(count => count + adder);
      setHistory(history => history.concat([`Added ${adder}`]));
    };
  });

  return button;
};

const textInput = setAdder => {
  const input = element("input", {
    onchange: e => {
      setAdder(parseInt(e.target.value, 10));
    },
  });
  return input;
}

const list = onHistory => {
  const ul = element("ul");

  onHistory(history => {
    const lis = history.map(entry => {
      return element("li", { textContent: entry });
    });

    ul.replaceChildren(...lis);
  });

  return ul;
}

register("tiny-app", (root) => {
  const [onAdder, setAdder] = state(1);
  const [onCount, setCount] = state(0);
  const [onHistory, setHistory] = state([]);

  const { pushState, onRoute } = route();

  const ele = router({
    "/a": () => element("div", { textContent: "a" }),
    "/b": () => element("div", { textContent: "b" }),
    "*": () => element("div", { textContent: "*" }),
  }, onRoute);

  onRoute(console.log);

  return container(
    counter(onCount),
    textInput(setAdder),
    add(onAdder, setCount, setHistory),
    list(onHistory),
    ele,
    element("button", {
      textContent: "a",
      onclick: () => pushState("/#/a"),
    }),
    element("button", {
      textContent: "b",
      onclick: () => pushState("/#/b"),
    }),
    element("button", {
      textContent: "*",
      onclick: () => pushState("/"),
    }),
  );
});
