import { element as e, ref } from "../../tiny.js";

const article = (img, author, date, title, description) => {
	return e("div.article-preview",
		e("div.article-meta",
		),
		e("a.preview-link[href]",
			e("h1", title),
			e("p", description),
			e("span", "Read more..."),
		),
	);
};

const sidebar = tags => {
	return e("div.col-md-3",
		e("div.sidebar", 
			e("p", "Popular tags"),
			e("div.tag-list",
				...tags.map(tag => e("a.tag-pill.tag-default", tag))
			),
		),
	);
};

export const home = () => {
	const html =  e("div.home-page", 
		e("div.banner", 
			e("div.container",
				e("h1.logo-font", "Conduit"),
				e("p", "A place to share your knowledge."),
			),
		),
		article("asdf", "Julian", "asd", "title", "description"),
		sidebar(["programming", "javascript"]),
	);

	return html;
};
