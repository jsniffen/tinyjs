import { element, mount } from "../../tiny.js"
import { home } from "./home.js"

mount("tiny-realworld", () => {
  return home()
})
