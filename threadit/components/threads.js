import { post } from "./post.js";
import { style, element, state, register, location } from "../tiny.js";
import { createThread, getThreads } from "../services/threadit.js";

const threadsState = state([]);

const fetchThreads = async () => {
  const threads = await getThreads();
  threadsState.set(threads);
}
fetchThreads();

const threadsStyles = style(`
  a {
    display: block;
    color: black;
    text-decoration: none;
  }

  a:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  textarea {
    width: 100%;
    height: 100px;
    display: block;
  }
`);


const row = thread => {
  const text = element("a", {
    onclick: () => {
      location.go(`/thread/${thread.id}`);
    },
    textContent: thread.text.substring(0, 150) + "...",
  });

  const comments = element("em", {
    textContent: `${thread.comment_count} comment(s)`
  });

  return element("div", {},
    text,
    comments,
    element("hr"),
  );
};


const threads = () => {
  const container = element("div");

  threadsState.subscribe(threads => {
    container.innerHTML = "";

    threads
      .map(thread => row(thread))
      .forEach(thread => container.append(thread));
  })

  const form = post(txt => createThread(txt).then(() => fetchThreads()));

  return element("div", {},
    threadsStyles,
    container,
    form,
  );
};

export { threads };
