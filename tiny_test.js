import {mount, element, ref, state, test, tests} from "./tiny.js"

const [onTests] = tests

mount("tiny-test", () => {
  const container = element("div")

  onTests(tests => {
    const divs = []
    for (const {error, status, name, time} of tests) {
      divs.push(
        element("div",
          `${status} ${name} (${time}s)`,
          element("br"),
          `${error?.stack ?? ""}`
        )
      )
    }
    container.replaceChildren(...divs)
  })

  return container
})

test("element should return HTMLElement", fail => {
  if (!(element("div") instanceof HTMLElement)) {
    fail("return type is not an instance of HTMLElement")
  }
})

test("element should append children", fail => {
  const lis = [element("li"), element("li"), element("li")]
  const ol = element("ol", ...lis)
  for (const li of lis) {
    if (!ol.contains(li)) {
      fail("ol does not contain li")
    }
  }
})

test("element should use ref", fail => {
  const divRef = ref()
  const div = element("button", {ref: divRef})
  if (divRef.element !== div) {
    fail("element did not use ref")
  }
})

test("element should throw error if ref used incorrectly", fail => {
  let error = null
  try {
    element("button", {ref: "abc"})
  } catch (e) {
    error = e
  }
  if (error === null) {
    fail("error not thrown")
  }
})

test("element should parse CSS selector", fail => {
  const tests = {
    "div": {type: "DIV", id: "", classes: [], selectors: {}},
    "div#id": {type: "DIV", id: "id", classes: [], selectors: {}},
    "div.foo": {type: "DIV", id: "", classes: ["foo"], selectors: {}},
    "div#id.class[key='value']": {type: "DIV", id: "id", classes: ["class"], selectors: {key: "value"}},
  }

  for (const test in tests) {
    const {type, id, classes, selectors} = tests[test]
    const el = element(test)
    if (el.tagName !== type) {
      fail(`element type is: ${el.tagName}; want ${type}`)
    }
    if (el.id !== id) {
      fail(`element ID is: ${el.id}; want ${id}`)
    }
    for (const cl of classes) {
      if (!el.classList.contains(cl)) {
        fail(`element missing class: ${cl}`)
      }
    }
    for (const key in selectors) {
      const want = selectors[key]
      const got = el.getAttribute(key)
      if (want !== got) {
        fail(`element[${key}] = ${got}; want: ${want}`)
      }
    }
  }
})

test("mount should append element", fail => {
  const parent = element("div#test-id")
  document.body.append(parent)

  if (parent.children.length > 0) {
    fail("parent should have 0 children")
  }

  const child = element("div")
  mount("test-id", () => child)

  if (!parent.contains(child)) {
    fail("parent does not contain child")
  }

  document.body.removeChild(parent)
})

test("mount should append multiple elements", fail => {
  const parent = element("div#test-id")
  document.body.append(parent)

  if (parent.children.length > 0) {
    fail("parent should have 0 children")
  }

  const children = [element("div"), element("div")]
  mount("test-id", () => children)

  for (const child of children) {
    if (!parent.contains(child)) {
      fail("parent does not contain child")
    }
  }

  document.body.removeChild(parent)
})

test("mount should throw error if id not found", fail => {
  try {
    mount("bad-id", () => element("div"))
  } catch (_) {
    return
  }
  fail("no error thrown")
})

/*
test("state should watch changes", fail => {
  const [onCount, setCount] = state(0)

  const div = element("div")
  onCount(count => div.textContent = count)

  for (let i = 0; i < 10; i++) {
    setCount(i)
    if (div.textContent != i) {
      fail(`div.textContent = ${div.textContent}; want ${i}`)
    }
  }
})

test("state should defer", fail => {
  const [onCount, setCount] = state(0)
  const div = element("div")
  onCount(count => {
    fail("this callback should not run")
  }, true)
})

test("state should get", fail => {
  const want = 10
  const [onCount, setCount] = state(want)
  const got = onCount(null)
  if (want !== got) {
    fail(`want: ${want}; got: ${got}`)
  }
})

test("subscribe should only initialize once", fail => {
  const [onCount, setCount] = state(0)
  const [onLoading, setLoading] = state(false)

  let ran = 0

  subscribe((count, loading) => {
    ran++
    if (ran > 1) {
      fail("subscribe initialized more than once")
    }
  }, onCount, onLoading)
})

test("subscribe should watch changes", fail => {
  const [onCount, setCount] = state(0)
  const [onLoading, setLoading] = state(false)

  const div = element("div")

  subscribe((count, loading) => {
    div.textContent = count
    div.hidden = loading
  }, onCount, onLoading)

  if (div.hidden) {
    fail("div should not hidden")
  }
  if (div.textContent != 0) {
    fail(`div.textContent = ${div.textContent}; want 0`)
  }

  setCount(1)
  if (div.hidden) {
    fail("div should not hidden")
  }
  if (div.textContent != 1) {
    fail(`div.textContent = ${div.textContent}; want 1`)
  }
  setLoading(true)
  if (!div.hidden) {
    fail("div should be hidden")
  }
  if (div.textContent != 1) {
    fail(`div.textContent = ${div.textContent}; want 1`)
  }
})
*/
