import { route, style, element, state, register } from "../tiny.js";
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
  const component = route({
    "/thread/:id": args => comments(args.id),
    "_": () => threads(),
  });

  return element("div", { className: "card" },
    appCss,
    component
  );
});
 
