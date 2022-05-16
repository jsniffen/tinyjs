import { style, element, state, register, which } from "../tiny.js";
import { getComments, createComment } from "../services/threadit.js";
import { post } from "./post.js";

const commentsState = state([])

const fetchComments = id => {
    getComments(id).then(comments => {
      commentsState.set(comments);
    });
}

const commentChain = (id, comments, i) => {
  const comment = comments[i];

  const children = element("div");

  for (let j = 0; j < comment.children.length; j++) {
    children.append(commentChain(id, comments, i+j+1));
  }

  const showReplyButton = state(true);

  const reply = element("div", {
    className: "reply",
    textContent: "reply",
    onclick: () => {
      showReplyButton.set(!showReplyButton.get());
    },
  });

  const replyForm = post(txt => {
    createComment(comment.id, txt).then(() => fetchComments(id))
  });

  return element("div", {
    "style": "display: flex"
  },
    element("div", { className: "vertical-line" }),
    element("div", {},
      element("p", { textContent: comment.text }),
      element("hr"),
      which(showReplyButton, reply, replyForm),
      children,
    )
  );
};

const css = `
  .vertical-line {
    border-left: 2px solid black;
    margin-right: 10px;
  }

  .reply:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

register("ti-comments", root => {
  const id = root.getAttribute("thread-id");
  fetchComments(id);

  const container = element("div", {});
  commentsState.subscribe(comments => {
    container.innerHTML = "";

    for (let i = 0; i < comments.length; i++) {
      if (comments[i].parent_id) continue;

      container.append(commentChain(id, comments, i));
    }
  });

  return element("div", {}, container, style(css));
});

export const comments = id => {
  const comments = element("ti-comments", {
    "thread-id": id,
  });
  return comments;
};
