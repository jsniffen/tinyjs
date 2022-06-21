import { element, mount } from "../../tiny.js"

const cToF = n => {
  return n*9/5 + 32
}

const fToC = n => {
  return (n-32)*5/9
}

mount("my-temperature", () => {
  const f = element("input", {
    onkeydown: e => {
      if (e.code === "Enter") {
        const value = parseInt(f.value).toFixed(2)
        if (value) {
          c.value = fToC(value)
        }
      }
    }
  })

  const c = element("input", {
    onkeydown: e => {
      if (e.code === "Enter") {
        const value = parseInt(c.value).toFixed(2)
        if (value) {
          f.value = cToF(value)
        }
      }
    }
  })

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
  )
})
