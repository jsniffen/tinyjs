import { element, register, state, subscribe } from "./tiny.js";

register("tiny-app", (root) => {
  const [onCount, setCount] = state(0, "count");
  const [onLoading, setLoading] = state(false, "loading");

  const loading = element("div", {
    textContent: "LOADING",
    hidden: loading => !loading,
  });

  return element("div",
    element("div", {
      textContent: count => count, 
      hidden: loading => loading,
    }),
    loading,
    element("button", {
      textContent: "Add 1",
      onclick: () => setCount(count => count+1),
    }),
    element("button", {
      textContent: "Load",
      onclick: () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 3000);
      },
    }),
    element("button", {
      textContent: "connected",
      onclick: () => {
        console.log(loading.isConnected);
      },
    }),
    element("div",
      count => {
        const loaders = [];
        for (let i = 0; i < count; i++) {
          loaders.push(element("div", {
            textContent: "LOADING!!!",
            hidden: loading => !loading,
          }));
        }
        return loaders;
      },
    ),
  );
});
