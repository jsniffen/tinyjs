import {mount, element, ref, state} from "./tiny.js"

const tests = [];

const test = (name, func) => {
    let message = "";
    const start = performance.now();

    try {
        message = func();
    } catch (err) {
        message = err.toString();
    } finally {
        const time = ((performance.now() - start)/1000).toFixed(2);
        tests.push({
            name,
            time,
            message,
        });
    }
};

test("element should return HTMLElement", () => {
    if (!(element("div") instanceof HTMLElement)) {
        return "return type is not an instance of HTMLElement";
    }
});

test("element should append children", () => {
    const lis = [element("li"), element("li"), element("li")];
    const ol = element("ol", ...lis);
    for (const li of lis) {
        if (!ol.contains(li)) {
            return "ol does not contain li";
        }
    }
});

test("element should set attributes", () => {
    const attributes = {
        id: "id",
        foo: "bar",
        className: "class",
        hidden: true,
        "x-data-test": "x-data-test",
    };
    const div = element("div", attributes);
    for (const key in attributes) {
        const value = attributes[key];
        if (key in div) {
            if (div[key] !== value) {
                return `div[${key}] is ${div[key]}; want ${value}`;
            }
        } else {
            if (value !== div.getAttribute(key, value)) {
                return `div.getAttribute(${key}) is ${div.getAttribute(key)}; want ${value}`;
            }
        }
    }
});

test("element should use ref", () => {
    const divRef = ref();
    const div = element("button", {ref: divRef});
    if (divRef.element !== div) {
        return "element did not use ref";
    }
});

test("element should throw error if ref used incorrectly", () => {
    let error = null;
    try {
        element("button", {ref: "abc"});
    } catch (e) {
        error = e;
    }
    if (error === null) {
        return "error not thrown";
    }
});

test("element should parse CSS selector", () => {
    const tests = {
        "div": {type: "DIV", id: "", classes: [], selectors: {}},
        "div#id": {type: "DIV", id: "id", classes: [], selectors: {}},
        "div.foo": {type: "DIV", id: "", classes: ["foo"], selectors: {}},
        "div#id.class[key='value']": {type: "DIV", id: "id", classes: ["class"], selectors: {key: "value"}},
    };

    for (const test in tests) {
        const {type, id, classes, selectors} = tests[test];
        const el = element(test)
        if (el.tagName !== type) {
            return `element type is: ${el.tagName}; want ${type}`;
        }
        if (el.id !== id) {
            return `element ID is: ${el.id}; want ${id}`;
        }
        for (const cl of classes) {
            if (!el.classList.contains(cl)) {
                return `element missing class: ${cl}`;
            }
        }
        for (const key in selectors) {
            const want = selectors[key];
            const got = el.getAttribute(key);
            if (want !== got) {
                return `element[${key}] = ${got}; want: ${want}`;
            }
        }
    }
});

test("mount should append element", () => {
    const parent = element("div#test-id");
    document.body.append(parent);

    if (parent.children.length > 0) {
        return "parent should have 0 children";
    }

    const child = element("div");
    mount("test-id", () => child);

    if (!parent.contains(child)) {
        return ("parent does not contain child");
    }

    document.body.removeChild(parent)
});

test("mount should append multiple elements", () => {
    const parent = element("div#test-id");
    document.body.append(parent);

    if (parent.children.length > 0) {
        return "parent should have 0 children";
    }

    const children = [element("div"), element("div")];
    mount("test-id", () => children);

    for (const child of children) {
        if (!parent.contains(child)) {
            return "parent does not contain child";
        }
    }

    document.body.removeChild(parent);
});

test("mount should throw error if id not found", () => {
    try {
        mount("bad-id", () => element("div"));
    } catch (_) {
        return;
    }
    return "no error thrown";
});

test("state should watch changes", () => {
	const [onCount, setCount] = state(0);

	const div = element("div");
	onCount(count => div.textContent = count);

	for (let i = 0; i < 100; i++) {
		setCount(i);
		if (div.textContent != i) {
			return `div.textContent = ${div.textContent}; want ${i}`;
		}
	}
});

test("state should get", () => {
	const want = 10;
	const [onCount, setCount] = state(want);
	const got = onCount(null);
	if (want !== got) {
		return `want: ${want}; got: ${got}`;
	}
});

mount("main", () => {
    return tests.map(test => {
        const pass = test.message === undefined;

        const symbol = pass ? "✓" : "✗";
        const className =  pass ? "test test--pass" : "test test--fail";

        const title = `${symbol} ${test.name} (${test.time}s)`;
        
        const message = element("div.test.test--message", test.message);

        return element("div", { className }, title, message);
    });
});


/*

test("state should defer", fail => {
  const [onCount, setCount] = state(0)
  const div = element("div")
  onCount(count => {
    fail("this callback should not run")
  }, true)
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
