import { Page } from "./Page.ts";
import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";
import { RequestEnvironment } from "../Util/RequestEnvironment.ts";

export class HomePage extends Page {
	_request: ServerRequest;
	_environment: RequestEnvironment;

	private constructor(requestEnvironment: RequestEnvironment) {
		super();
		this._environment = requestEnvironment;
		this._request = requestEnvironment.request;
	}

	public getResponse(): Object {
		let Rbody = "hi! This request was sent with method: " + this._request.method + " and the url used was: " + this._request.url;

		return { body: Rbody, status: 200 };
	}

	static new(environment: RequestEnvironment): Page {
		return new HomePage(environment);
	}
}

export class basicGet extends Page {
	_request: ServerRequest;
	_environment: RequestEnvironment;

	private constructor(env: RequestEnvironment) {
		super();
		this._environment = env;
		this._request = env.request;
	}

	public getResponse(): Object {
		let Rbody = "hi! This request was sent with GET and the url used was: " + this._request.url;

		return { body: Rbody, status: 200 };
	}

	static new(env: RequestEnvironment): Page {
		return new basicGet(env);
	}
}
export class basicPut extends Page {
	_request: ServerRequest;
	_environment: RequestEnvironment;

	private constructor(env: RequestEnvironment) {
		super();
		this._environment = env;
		this._request = env.request;
	}

	public getResponse(): Object {
		let Rbody = "hi! This request was sent with PUT and the url used was: " + this._request.url;

		return { body: Rbody, status: 200 };
	}

	static new(env: RequestEnvironment): Page {
		return new basicPut(env);
	}
}
export class basicPost extends Page {
	_request: ServerRequest;
	_environment: RequestEnvironment;

	private constructor(env: RequestEnvironment) {
		super();
		this._environment = env;
		this._request = env.request;
	}

	public getResponse(): Object {
		let Rbody = "hi! This request was sent with POST and the url used was: " + this._request.url;

		return { body: Rbody, status: 200 };
	}

	static new(env: RequestEnvironment): Page {
		return new basicPost(env);
	}
}
export class basicDelete extends Page {
	_request: ServerRequest;
	_environment: RequestEnvironment;

	private constructor(env: RequestEnvironment) {
		super();
		this._environment = env;
		this._request = env.request;
	}

	public getResponse(): Object {
		let Rbody = "hi! This request was sent with DELETE and the url used was: " + this._request.url;

		return { body: Rbody, status: 200 };
	}

	static new(env: RequestEnvironment): Page {
		return new basicDelete(env);
	}
}
