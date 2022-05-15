
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


const comments = id => {
  const commentsState = state([])

  const fetchComments = () => {
    getComments(id).then(comments => {
      commentsState.set(comments);
    });
  };
  fetchComments();

  const commentChain = (comments, i) => {

    const comment = comments[i];

    const text = element("p", {
      textContent: comment.text,
    });

    const children = element("div");

    for (let j = 0; j < comment.children.length; j++) {
      children.append(commentChain(comments, i+j+1));
    }

    const showReplyButton = state(true);

    const reply = element("div", {
      textContent: "reply",
      onclick: () => {
        showReplyButton.set(!showReplyButton.get());
      },
    });

    const replyForm = post(txt => {
      createComment(comment.id, txt).then(() => fetchComments())
    });

    showReplyButton.subscribe(show => {
      reply.hidden = !show;
      replyForm.hidden = show;
    });

    return element("div", {
      "style": "display: flex"
    },
      element("div", { className: "vertical-line" }),
      element("div", {},
        text,
        element("hr"),
        reply,
        replyForm,
        children,
      )
    );
  };


  const container = element("div");
  commentsState.subscribe(comments => {
    container.innerHTML = "";

    for (let i = 0; i < comments.length; i++) {
      if (comments[i].parent_id) continue;

      container.append(commentChain(comments, i));
    }
  });
  return container;
};
