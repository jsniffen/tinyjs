const reply = () => {
  const input = element("textarea");

  const post = element("button", {
    textContent: "Post",
    onclick: () => {
      const value = input.value;
      input.value = "";

      createThread(value).then(r => {
        console.log(r);
        fetchThreads();
      });
    },
  });

  return element("div", {}, input, post);
}
