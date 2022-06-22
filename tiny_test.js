import { mount, element, state, subscribe, test } from "./tiny.js"

test("element should return HTMLElement", fail => {
  if (!(element("div") instanceof HTMLElement)) {
    fail("return type is not an instance of HTMLElement")
  }
})

test("element should parse css selector", fail => {
  const div = element("div#id.class1.class2[foo=bar][bazz=buzz]")
  if (div.id !== "id") {
    fail(`id is ${div.id}; want "id"`)
  }

  for (const className of ["class1", "class2"]) {
    if (!div.classList.contains(className)) {
      fail(`div does not contain className: ${className}`)
    }
  }

  const attrs = {"foo": "bar", "bazz": "buzz"}
  for (const key in attrs) {
    const value = attrs[key]
    if (div.getAttribute(key) !== value) {
      fail(`div[${key}] is ${div.getAttribute(key)}; want ${value}`)
    }
  }
})

test("element should apply attributes", fail => {
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

test("element should append children", fail => {
  const lis = [element("li"), element("li"), element("li")]
  const ol = element("ol", {}, ...lis)
  for (const li of lis) {
    if (!ol.contains(li)) {
      fail("ol does not contain li")
    }
  }
})

test("mount should append element", fail => {
  const parent = element("div", { id: "test-id" })
  document.body.append(parent)

  if (parent.children.length > 0) {
    fail("parent should have 0 children")
  }

  mount("test-id", () => element("div"))

  if (parent.children.length !== 1) {
    fail("parent should have 1 child")
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
