import { newState, router, style, element, state, register } from "../tiny.js";
import { comments } from "./comments.js";
import { threads } from "./threads.js";
import { post } from "./post.js";

const appCss = style(`
  .card {
    padding: 25px;
    background: white;
    border: 1px solid gray;
    border-radius: 5px;
  }
`);

register("ti-app", (_) => {
  const [subscribe, update] = newState(true);

  const text = element("text");
  const button = element("button", {
    textContent: "click",
    // onclick: () => {
      // update(state => !state);
    // },
  });

  // subscribe(curr => {
    // text.textContent = curr ? "yes" : "no";
  // });

  return element("div", { className: "card" },
    appCss,
    text,
    button,
    router({
      "/thread/:id": args => comments(args.id),
      "_": () => threads(),
    }),
  );
});
 
