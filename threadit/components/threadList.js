const threadListStyles = style(`
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
    href: `/thread/${thread.id}`,
    textContent: thread.text.substring(0, 100) + "...",
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

const threadList = () => {
  const container = element("div");

  threads.subscribe(threads => {
    container.innerHTML = "";

    threads
      .map(thread => row(thread))
      .forEach(thread => container.append(thread));
  });

  const div = element("div", {},
    threadListStyles,
    container,
    reply(),
  );

  selectedThread.subscribe(thread => {
    div.hidden = !!thread;;
  });

  return div;
};
register("thread-list", threadList);
