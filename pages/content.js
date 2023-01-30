import { element as e, mount, state, route, router } from "./../tiny.js";

export const sections = [
	{
		id: "tinyjs",
		title: "TinyJS",
		text: "TinyJS is a simple Javascript framework.",
		link: "#/tinyjs",
	},
	{
		id: "elements",
		title: "Elements",
		text: "TinyJS allows you to create elements with the element function.",
		link: "#/elements",
		divId: "my-elements",
		code: () => {
			// import { element as e, mount } from "./tiny.js";
			//
			const alertButton = e("button", {
				textContent: "Click me!",
				onclick: () => alert("I've been clicked!"),
			});

			const disabledButton = e("button[disabled]", "disabled");

			const paragraph = e("p.style--bold", "Lorem ipsum...");

			const input = e("input[placeholder='test'][type='text']");

			mount("my-elements",
				alertButton,
				disabledButton,
				paragraph,
				input,
			);
		},
	},
	{
		id: "state",
		title: "State",
		text: "TinyJS has functions for creating and subscribing to state objects.",
		link: "#/state",
		divId: "my-counter",
		code: () => {
			// import { element as e, mount, state } from "./tiny.js"
			//
			mount("my-counter", () => {
				const [onCount, setCount] = state(0);

				const addOne = e("button", {
					onclick: () => setCount(count => count + 1),
				}, "Add 1");

				const subtractOne = e("button", {
					onclick: () => setCount(count => count - 1),
				}, "Subtract 1");

				const reset = e("button", {
					onclick: () => setCount(0),
				}, "Reset to 0");

				const status = e("div");

				onCount(count => {
					status.textContent = `Count: ${count}`;
				});

				return [status, addOne, subtractOne, reset];
			});
		},
	},
];
