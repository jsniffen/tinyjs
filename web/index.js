const items = state([]);

const list = () => {
	const list = element("ol");
	items.subscribe(items => {
		list.textContent = "";

		items.forEach(item => {
			const li = document.createElement("li");
			li.innerHTML = item;
			list.append(li);
		});
	});
	return list;
};


const input = (el) => {
	const input = element("input");

	const placeholder = el.getAttribute("placeholder");
	if (placeholder) {
		input.placeholder = placeholder;
	}

	const border = el.getAttribute("border");
	if (border) {
		input.style.border = "5px solid black";
	}


	input.onkeydown = e => {
		if (e.code == "Enter") {
			items.set([...items.get(), e.target.value]);
			input.value = "";
		}
	};
	return input;
};

const button = (root) => {
	const button = element("button", {
		textContent: "clear",
		onclick: e => {
			items.set([]);
		},
	});

	const text = root.getAttribute("text");
	if (text) {
		button.textContent = text;
	}

	return button;
};

const header = () => {
	const css = style(`
		div {
			height: 100px;
			border: 5px solid orange;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 25px;
		}
	`);

	const header = element("div", {},
		css,
		element("slot", {name: "title1"}),
		element("slot", {name: "title2"}),
		element("slot", {name: "title3"}),
	);

	return header;
}

register("todo-header", header);
register("todo-button", button);
register("todo-input", input);
register("todo-list", list);

