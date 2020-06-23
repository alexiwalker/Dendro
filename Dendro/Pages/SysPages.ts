import {Page} from "./mod.ts";

/**
 * A default 400s status code page
 * This is used by default when no route can be found for a given url
 * todo: a way to set custom 400 page HTML
 */
export class Page4XX extends Page {
	statusCode: number = 400;

	constructor(status: number) {
		super();
		if (!(this.statusCode >= 400 && this.statusCode < 500)) {
			throw new RangeError("non-4XX value provided for 4XX error page");
		}
		this.statusCode = status;
	}

	public getResponse(): Object {
		return {body: this.statusCode.toString(), status: this.statusCode};
	}
}

/**
 * A default 500s status code page.
 * This is used by default when the server encounters some uncaught error while serving another page
 *
 * todo: a way to set custom 500 page HTML
 */
export class Page5XX extends Page {
	statusCode: number = 500;

	constructor(status: number) {
		super();
		if (!(this.statusCode >= 500 && this.statusCode < 600)) {
			throw new RangeError("non-4XX value provided for 4XX error page");
		}
		this.statusCode = status;
	}

	public getResponse(): Object {
		return {body: this.statusCode.toString(), status: this.statusCode};
	}
}
