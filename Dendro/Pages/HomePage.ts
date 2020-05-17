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

export class Page404 extends Page {
	public getResponse(): Object {
		return { body: "404", status: 404 };
	}
}

export class Page500 extends Page {
	public getResponse(): Object {
		return { body: "404", status: 500 };
	}
}
