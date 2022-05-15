const post = submit => {
  const textarea = element("textarea", {
    onkeydown: e => {
      if (e.code === "Enter") {
        const value = textarea.value;
        submit(value);
        textarea.value = "";
      }
    },
  });

  const button = element("button", {
    textContent: "Post!",
    onclick: () => {
        const value = textarea.value;
        submit(value);
        textarea.value = "";
    },
  });

  return element("div", {}, textarea, button);
}
