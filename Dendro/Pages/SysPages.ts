import { Page } from "./mod.ts";

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
		return { body: this.statusCode.toString(), status: this.statusCode };
	}
}

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
		return { body: this.statusCode.toString(), status: this.statusCode };
	}
}
