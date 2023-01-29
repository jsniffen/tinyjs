import { mount, element, route, router, state } from "./tiny.js"
import { sections } from "./content.js"

const [onActiveSection, setActiveSection] = state(0)

onActiveSection(section => {
  const element = document.getElementById(sections[section].id)
  if (element) element.scrollIntoView()
})

const example = (code) => {
  if (!code) return ""

  let textContent = code.toString()
    .split("\n")
    .slice(1, -1)

  let trimLeft = 0;
  for (let c of textContent[0]) {
    if (c == "\n") {
      continue
    } else if (c === " ") {
      trimLeft++
      continue
    } else {
      break
    }
  }

  textContent = textContent
    .map(line => line.substring(trimLeft))
    .map(line => {
      if (line[0] === "/" && line[1] === "/") {
        return line.substring(3)
      }
      return line
    })
    .join("\n")


  return element("div", {
    className: "code",
    textContent,
  })
}

const sidebar = () => {
  const div = element("div", { className: "flex flex-col sidebar" })

  const buttons = []
  for (let i = 0; i < sections.length; i++) {
    const { title, text, link } = sections[i]

    const button = element("button", {
      textContent: sections[i].title,
      onclick: () => {
        setActiveSection(i)
      }
    })
    buttons.push(button)
    div.append(button)
  }

  onActiveSection(currentSection => {
    buttons.forEach((button, i) => {
      if (i === currentSection) {
        button.classList.add("active")
      } else {
        button.classList.remove("active")
      }
    })
  })

  return div
}

const placeholder = id => {
  if (!id) return ""

  return element("div", { id, className: "placeholder" })
}

const content = () => {
  const div = element("div")

  for (let section of sections) {
    const { id, code, title, text, divId } = section

    div.append(
      element("section", { id }, 
        element("h1", { textContent: title }),
        element("p", { textContent: text }),
        example(code),
        placeholder(divId),
      )
    )
  }

  return div
}

mount("tiny-app", () => {
  return element("div", {
    className: "flex flex-row"
  },
    sidebar(),
    content(),
  )
})

for (const section of sections) {
  if (section.code) section.code()
}
