import { mount, element, route, router, state } from "./../tiny.js";
import { sections } from "./content.js";

const example = (code) => {
	if (!code) return "";

	let textContent = code.toString()
		.split("\n")
		.slice(1, -1);

	let trimLeft = 0;
	for (let c of textContent[0]) {
		if (c == "\n") {
			continue;
		} else if (c === "\t") {
			trimLeft++;
			continue;
		} else {
			break;
		}
	}

	textContent = textContent
		.map(line => line.substring(trimLeft))
		.map(line => {
			if (line[0] === "/" && line[1] === "/") {
				return line.substring(3);
			}
			return line;
		})
		.join("\n");


	return element("div", {
		className: "code",
		textContent,
	});
}

const placeholder = id => {
	if (!id) return "";

	return element(`div#${id}.placeholder`);
}

const content = () => {
	const div = element("div")

	for (let section of sections) {
		const { id, code, title, text, divId } = section;

		div.append(
			element("section", { id }, 
				element("h1", { textContent: title }),
				element("p", { textContent: text }),
				example(code),
				placeholder(divId),
			)
		);
	}

	return div;
}

mount("main", content());

for (const section of sections) {
	if (section.code) section.code();
}
