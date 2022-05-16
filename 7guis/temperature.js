import { route, style, element, state, register } from "../tiny.js";

const cToF = n => {
  return n*9/5 + 32;
};

const fToC = n => {
  return (n-32)*5/9;
}

register("my-temperature", _ => {
  const f = element("input", {
    onkeyup: () => {
      const value = parseInt(f.value);
      if (value) {
        c.value = fToC(value);
      }
    }
  });

  const c = element("input", {
    onkeyup: () => {
      const value = parseInt(c.value);
      if (value) {
        f.value = cToF(value);
      }
    }
  });

  return element("div", {},
    element("p", { textContent: "Temperature Converter" }),
    element("div", {}, 
      element("span", { textContent: "Fahrenheit: " }),
      f,
    ),
    element("div", {}, 
      element("span", { textContent: "Celsius: " }),
      c,
    ),
  );
});
