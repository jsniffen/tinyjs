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


const input = () => {
	const input = element("input");
	input.onkeydown = e => {
		if (e.code == "Enter") {
			items.set([...items.get(), e.target.value]);
			input.value = "";
		}
	};
	return input;
};

const button = () => {
	return element("button", {
		textContent: "clear",
		onclick: e => {
			items.set([]);
		},
	});
};

register("todo-button", button);
register("todo-input", input);
register("todo-list", list);

