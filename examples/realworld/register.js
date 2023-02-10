import { element as e, ref } from "../../tiny.js";

export const register = () => {
	const name = ref();
	const email = ref();
	const password = ref();
	const errors = ref();
	const submit = ref();

	const html = e("div.auth-page",
		e("div.container.page",
			e("div.row", 
				e("div.col-md-6.offset-md-3.col-xs-12",
					e("h1.text-xs-center", "Sign up"),
					e("p.text-xs-center", e("a[href]", "Have an account?")),
					e("ul.error-messages", {errors}),
					e("form",
						e("fieldset.form-group",
							e("input.form-control.form-control-lg[type='text'][placeholder='Your Name']", {name}),
						),
						e("fieldset.form-group",
							e("input.form-control.form-control-lg[type='text'][placeholder='Email']", {email}),
						),
						e("fieldset.form-group",
							e("input.form-control.form-control-lg[type='text'][placeholder='Password']", {password}),
						),
						e("button.btn.btn-lg.btn-primary.pull-xs-right", {submit}, "Sign up"),
					),
				),
			),
		),
	);

	return html;
};
