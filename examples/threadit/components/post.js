import { style, element, state, register } from "../tiny.js";

const css = `
  textarea {
    font-size: 1.5em;
    display: block;
  }

  button {
    background-color: purple;
    color: white;
    margin: 10px 0;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 1em;
  }

  button:hover {
    cursor: pointer;
  }
`;

register("ti-post", root => {
  const textarea = element("textarea", {
    onkeydown: e => {
      if (e.code === "Enter") {
        submitEvent();
      }
    },
  });

  const button = element("button", {
    textContent: "Post!",
    onclick: () => {
      submitEvent();
    },
  });

  const submitEvent = () => {
    const text = textarea.value;
    textarea.value = "";

    const event = new CustomEvent("ti-post-submit", {
      detail: {
        text: text,
      },
    });
    root.dispatchEvent(event);
  };

  return element("div", {},
    style(css),
    textarea,
    button,
  );
});

export const post = submit => {
  const post = element("ti-post");

  post.addEventListener("ti-post-submit", e => {
    submit(e.detail.text);
  });

  return post;
};
