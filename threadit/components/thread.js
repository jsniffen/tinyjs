const css = style(`
  button {
    margin-top: 10px;
    display: block;
    background: purple;
    color: white;
    height: 40px;
    width: 80px;
    border: none;
    border-radius: 5px;
    font-size: 0.9em;
  }

  button:hover {
    cursor: pointer;
  }
`);

const comment = comment => {
  const reply = element("button", {
    textContent: "reply",
  });

  return element("div", {
    textContent: comment.text,
  }, 
    reply,
    element("hr"),
  );
};

const thread = () => {
  const div = element("div", {}, css);

  selectedThread.subscribe(id => {
    div.hidden = !id;

    if (id) {
      getComments(id).then(comments => {
        console.log(comments);
        comments.map(comment).forEach(e => {
          div.append(e);
        });
      });
    }
  });

  return div;
};

register("ti-thread", thread);
