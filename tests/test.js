import {mount, element, ref, state, router} from "./../tiny.js";

const tests = [];

const fail = msg => {
	throw new Error(msg)
};

const test = (name, func) => {
	let error = "";
	const start = performance.now();

	try {
		func(fail);
	} catch (err) {
		error = err.stack;
	} finally {
		const time = ((performance.now() - start)/1000).toFixed(2);
		tests.push({
			name,
			time,
			error,
		});
	}
};

test("element should return HTMLElement", fail => {
	if (!(element("div") instanceof HTMLElement)) {
		fail("return type is not an instance of HTMLElement");
	}
});

test("element should append children", fail => {
	const lis = [element("li"), element("li"), element("li")];
	const ol = element("ol", ...lis);
	for (const li of lis) {
		if (!ol.contains(li)) {
			fail("ol does not contain li");
		}
	}
});

test("element should set attributes", fail => {
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
				fail(`div[${key}] is ${div[key]}; want ${value}`);
			}
		} else {
			if (value !== div.getAttribute(key, value)) {
				fail(`div.getAttribute(${key}) is ${div.getAttribute(key)}; want ${value}`);
			}
		}
	}
});

test("element should use ref", fail => {
	const divRef = ref();
	const div = element("button", {ref: divRef});
	if (divRef.element !== div) {
		fail("element did not use ref");
	}
});

test("element should parse CSS selector", fail => {
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
			fail(`element type is: ${el.tagName}; want ${type}`);
		}
		if (el.id !== id) {
			fail(`element ID is: ${el.id}; want ${id}`);
		}
		for (const cl of classes) {
			if (!el.classList.contains(cl)) {
				fail(`element missing class: ${cl}`);
			}
		}
		for (const key in selectors) {
			const want = selectors[key];
			const got = el.getAttribute(key);
			if (want !== got) {
				fail(`element[${key}] = ${got}; want: ${want}`);
			}
		}
	}
});

test("mount should append element", fail => {
	const parent = element("div#test-id");
	document.body.append(parent);

	if (parent.children.length > 0) {
		fail("parent should have 0 children");
	}

	const child = element("div");
	mount("test-id", () => child);

	if (!parent.contains(child)) {
		fail("parent does not contain child");
	}

	document.body.removeChild(parent)
});

test("mount should append multiple elements", fail => {
	const parent = element("div#test-id");
	document.body.append(parent);

	if (parent.children.length > 0) {
		fail("parent should have 0 children");
	}

	const children = [element("div"), element("div")];
	mount("test-id", () => children);

	for (const child of children) {
		if (!parent.contains(child)) {
			fail("parent does not contain child");
		}
	}

	document.body.removeChild(parent);
});

test("mount should append a single raw element", fail => {
	const parent = element("div#test-id");
	document.body.append(parent);

	if (parent.children.length > 0) {
		fail("parent should have 0 children");
	}

	const child = element("div");
	mount("test-id", child);
	if (!parent.contains(child)) {
		fail("parent does not contain child");
	}

	document.body.removeChild(parent);
});

test("mount should append multiple raw elements", fail => {
	const parent = element("div#test-id");
	document.body.append(parent);

	if (parent.children.length > 0) {
		fail("parent should have 0 children");
	}

	const children = [element("div"), element("div")];
	mount("test-id", ...children);

	for (const child of children) {
		if (!parent.contains(child)) {
			fail("parent does not contain child");
		}
	}

	document.body.removeChild(parent);
});

test("mount should throw error if id not found", fail => {
	try {
		mount("bad-id", () => element("div"));
	} catch (_) {
		return;
	}
	fail("no error thrown");
});

test("state should watch changes", fail => {
	const [onCount, setCount] = state(0);

	const div = element("div");
	onCount(count => div.textContent = count);

	for (let i = 0; i < 100; i++) {
		setCount(i);
		if (div.textContent != i) {
			fail(`div.textContent = ${div.textContent}; want ${i}`);
		}
	}
});

test("state should get", fail => {
	const want = 10;
	const [onCount, setCount] = state(want);
	const got = onCount(null);
	if (want !== got) {
		fail(`want: ${want}; got: ${got}`);
	}
});

test("state should defer", fail => {
	const [onCount, setCount] = state(0);
	const div = element("div");

	onCount(count => {
		fail("this callback should not run");
	}, true);
});

test("router", fail => {
	const a = element("div", "one");
	const b = element("div", "one");
	const c = element("div", "one");
	const parent = router({
		"/a": () => a,
		"/b": () => b,
		"*": () => c,
	});

	if (!parent.contains(c)) {
		fail("parent does not contain c");
	}

	window.location.href = "#/a";
	if (!parent.contains(a)) {
		fail("parent does not contain a");
	}

	window.location.href = "#/b";
	if (!parent.contains(b)) {
		fail("parent does not contain b");
	}

	window.location.hash = "";
	if (!parent.contains(c)) {
		fail("parent does not contain c");
	}
});

mount("main", () => {
	return tests.map(test => {
		const pass = test.error === "";

		const symbol = pass ? "✓" : "✗";
		const className =  pass ? "test test--pass" : "test test--fail";

		const title = `${symbol} ${test.name} (${test.time}s)`;
		
		// Rewrite the error message to be pretty.
		if (test.error) {
			const lines = test.error.split("\n");
			const message = lines[0].replace("Error: ", "");
			const line = lines[2].split("/").at(-1).split(":").slice(0, 2).join(":");
			test.error = `${line}: ${message}`
		}
		const error = element("div.test.test--error", test.error);

		return element("div", { className }, title, error);
	});
});
