import { Page } from "./Page.ts";
import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

export class HomePage extends Page {
	_request: ServerRequest;

	private constructor(request: ServerRequest) {
		super();
		this._request = request;
	}

	public getResponse(): Object {
		let Rbody = "hi! This request was sent with method: " + this._request.method + " and the url used was: " + this._request.url;

		return { body: Rbody, status: 200 };
	}

	static new(request: ServerRequest): Page {
		return new HomePage(request);
	}
}

export class basicGet extends Page {
	_request: ServerRequest;

	private constructor(request: ServerRequest) {
		super();
		this._request = request;
	}

	public getResponse(): Object {
		let Rbody = "hi! This request was sent with GET and the url used was: " + this._request.url;

		return { body: Rbody, status: 200 };
	}

	static new(request: ServerRequest): Page {
		return new basicGet(request);
	}
}
export class basicPut extends Page {
	_request: ServerRequest;

	private constructor(request: ServerRequest) {
		super();
		this._request = request;
	}

	public getResponse(): Object {
		let Rbody = "hi! This request was sent with PUT and the url used was: " + this._request.url;

		return { body: Rbody, status: 200 };
	}

	static new(request: ServerRequest): Page {
		return new basicPut(request);
	}
}
export class basicPost extends Page {
	_request: ServerRequest;

	private constructor(request: ServerRequest) {
		super();
		this._request = request;
	}

	public getResponse(): Object {
		let Rbody = "hi! This request was sent with POST and the url used was: " + this._request.url;

		return { body: Rbody, status: 200 };
	}

	static new(request: ServerRequest): Page {
		return new basicPost(request);
	}
}
export class basicDelete extends Page {
	_request: ServerRequest;

	private constructor(request: ServerRequest) {
		super();
		this._request = request;
	}

	public getResponse(): Object {
		let Rbody = "hi! This request was sent with DELETE and the url used was: " + this._request.url;

		return { body: Rbody, status: 200 };
	}

	static new(request: ServerRequest): Page {
		return new basicDelete(request);
	}
}
