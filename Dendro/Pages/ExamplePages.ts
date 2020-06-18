import {Page} from "./Page.ts";
import {ServerRequest} from "https://deno.land/std@0.50.0/http/server.ts";
import {RequestEnvironment} from "../Util/RequestEnvironment.ts";

export class HomePage extends Page {
	_request: ServerRequest;
	_environment: RequestEnvironment;

	private constructor(requestEnvironment: RequestEnvironment) {
		super();
		this._environment = requestEnvironment;
		this._request = requestEnvironment.request;
	}

	static new(environment: RequestEnvironment): Page {
		return new HomePage(environment);
	}

	public getResponse(): Object {
		let Rbody = "hi! This request was sent with method: " + this._request.method + " and the url used was: " + this._request.url;

		return {body: Rbody, status: 200};
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

	static new(env: RequestEnvironment): Page {
		return new basicGet(env);
	}

	public getResponse(): Object {
		let Rbody = "hi! This request was sent with GET and the url used was: " + this._request.url;

		return {body: Rbody, status: 200};
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

	static new(env: RequestEnvironment): Page {
		return new basicPut(env);
	}

	public getResponse(): Object {
		let Rbody = "hi! This request was sent with PUT and the url used was: " + this._request.url;

		return {body: Rbody, status: 200};
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

	static new(env: RequestEnvironment): Page {
		return new basicPost(env);
	}

	public getResponse(): Object {
		let Rbody = "hi! This request was sent with POST and the url used was: " + this._request.url;

		return {body: Rbody, status: 200};
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

	static new(env: RequestEnvironment): Page {
		return new basicDelete(env);
	}

	public getResponse(): Object {
		let Rbody = "hi! This request was sent with DELETE and the url used was: " + this._request.url;

		return {body: Rbody, status: 200};
	}
}
