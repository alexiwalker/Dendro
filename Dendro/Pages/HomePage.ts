import { Page } from "./Page.ts";
import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

export class HomePage extends Page {
	_request: ServerRequest;

	private constructor(request: ServerRequest) {
		super();
		this._request = request;
	}

	public getResponse(): Object {
		let Rbody =
			"hi! This request was sent with method: " + this._request.method;

		return { body: Rbody, status: 200 };
	}

	static Get(request: ServerRequest): Page {
		return new HomePage(request);
	}
}

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
		//Todo: error code template
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
		//Todo: error code template
		return { body: this.statusCode.toString(), status: this.statusCode };
	}
}
