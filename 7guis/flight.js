import { route, style, element, state, register } from "../tiny.js";

const css = `
  div {
    max-width: 250px;
    display: flex;
    flex-direction: column;
  }

  .error {
    background-color: red;
  }
`;

const handleDateFormat = e => {
  const date = Date.parse(e.target.value);
  if (date) {
    e.target.classList.remove("error");
  } else {
    e.target.classList.add("error");
  }
};

register("my-flight", _ => {
  const oneWay = state(true);

  const options = element("select", {
    onchange: () => {
      oneWay.set(options.value === "one-way flight");
    },
  }, 
    element("option", {
      textContent: "one-way flight",
      value: "one-way flight",
    }),
    element("option", {
      textContent: "return flight",
      value: "return flight",
    }),
  );

  const startInput = element("input", { onkeydown: handleDateFormat });
  const endInput = element("input", { onkeydown: handleDateFormat });

  oneWay.subscribe(oneWay => {
    if (oneWay) {
      endInput.setAttribute("disabled", "");
    } else {
      endInput.removeAttribute("disabled");
    }
  });

  const button = element("button", {
    textContent: "Book",
    onclick: () => {
      alert(`You have booked a ${options.value} on ${startInput.value}`);
    },
  });

  return element("div", {},
    style(css),
    element("p", { textContent: "Flight Booker" }),
    options,
    startInput,
    endInput,
    button,
  );
});
