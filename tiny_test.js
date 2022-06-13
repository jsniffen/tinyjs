import { mount, element, test } from "./tiny.js"

const [ testTinyJS, runTinyJSTests ] = test("TinyJS")

testTinyJS("element should return HTMLElement", fail => {
  if (!(element("div") instanceof HTMLElement)) {
    fail("return type is not an instance of HTMLElement")
  }
})

testTinyJS("element should apply attributes", fail => {
  const attributes = {
    hidden: true,
    id: "id",
    href: "href",
  }

  const div = element("div", attributes)

  for (const key in attributes) {
    const want = attributes[key]
    const got = key in div ? div[key] : div.getAttribute(key)

    if (want !== got) fail(`div[${key}] is not ${want}, got: ${got}`)
  }
})

runTinyJSTests()
