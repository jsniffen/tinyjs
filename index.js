import { container, element, register, route, router, state, subscribe } from "./tiny.js";

const add = (onAdder, setCount) => {
  const button =  element("button");

  onAdder(adder => {
    button.textContent = `Add ${adder}`;
    button.onclick = () => {
      setCount(count => count + adder);
    };
  }, button);

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

const rootCount = onCount => {
  const div = element("div");
  onCount(count => {
    console.log("Root handling count");
    div.textContent = `Root: ${count}`;
    return div;
  }, div);
  return div;
};

const aCount = (onCount, onLoading) => {
  const div = element("div");

  subscribe((count, loading) => {
    console.log("A handling count and loading");
    div.textContent = loading ? "Loading" : `A: ${count}`;
  }, [onCount, onLoading], div);

  return div;
};

const bCount = onCount => {
  const div = element("div");
  onCount(count => {
    console.log("B handling count");
    div.textContent = `B: ${count}`;
  }, div);
  return div;
};

register("tiny-app", (root) => {
  const [onAdder, setAdder] = state(1);
  const [onCount, setCount] = state(0, "count");
  const [onLoading, setLoading] = state(false, "loading");
  const { pushState, onRoute } = route();

  const count = router({
    "/a": () => aCount(onCount, onLoading),
    "/b": () => bCount(onCount, onLoading),
    "*": () => rootCount(onCount, onLoading),
  }, onRoute);

  return container(
    textInput(setAdder),
    add(onAdder, setCount),
    count,
    element("button", {
      textContent: "Root",
      onclick: () => pushState("/"),
    }),
    element("button", {
      textContent: "A",
      onclick: () => pushState("/#/a"),
    }),
    element("button", {
      textContent: "B",
      onclick: () => pushState("/#/b"),
    }),
    element("button", {
      textContent: "Load",
      onclick: () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 5000);
      },
    }),
  );
});
