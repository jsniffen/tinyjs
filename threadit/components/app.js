const appCss = style(`
  .card {
    padding: 25px;
    background: white;
    border: 1px solid gray;
    border-radius: 5px;
  }

  textarea {
    font-size: 1.5em;
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
  
  .vertical-line {
    border-left: 2px solid black;
    margin-right: 10px;
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
