import { mount, router } from "../../tiny.js";

import { home } from "./home.js";
import { login } from "./login.js";
import { register } from "./register.js";

const h = home();
console.log(h);

mount("main", router({
	"/login": login, 
	"/register": register, 
	"*": home,
}));
