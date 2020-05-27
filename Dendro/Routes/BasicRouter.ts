import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

import { Page, Page4XX } from "../Pages/mod.ts";

import { IRouter, RouteValidator, RouteMap } from "./IRouter.ts";

import { PageProvider } from "../Dendro.ts";

//for method-based routing
const Post: string = "POST";
const Put: string = "PUT";
const Get: string = "GET";
const Delete: string = "DELETE";

export class BasicRouter implements IRouter {
	routes: RouteMap = new Map<RouteValidator, PageProvider>();

	constructor() {}
	implements: String[] = ["IRouter", "BasicRouter"];

	public linkRoute(validator: RouteValidator, page: PageProvider): void {
		this.routes.set(validator, page);
	}

	public url(url: string, page: PageProvider, checkParams: boolean = false): void {
		let fn: RouteValidator;

		if (!checkParams) {
			fn = (req: ServerRequest) => {
				return req.url.split("?")[0] == url;
			};
		} else {
			fn = (req: ServerRequest) => {
				return req.url == url;
			};
		}

		this.linkRoute(fn, page);
	}

	public get(url: string, page: PageProvider, checkParams: boolean = false) {
		this.linkRoute(BasicRouter._method(url, checkParams, Get), page);
	}

	public post(url: string, page: PageProvider, checkParams: boolean = false) {
		this.linkRoute(BasicRouter._method(url, checkParams, Post), page);
	}

	public put(url: string, page: PageProvider, checkParams: boolean = false) {
		this.linkRoute(BasicRouter._method(url, checkParams, Put), page);
	}

	public delete(url: string, page: PageProvider, checkParams: boolean = false) {
		this.linkRoute(BasicRouter._method(url, checkParams, Delete), page);
	}

	private static _method(url: string, checkParams: boolean = false, method: string): RouteValidator {
		let fn: RouteValidator;

		if (!checkParams) {
			fn = (req: ServerRequest) => {
				return req.url.split("?")[0] == url && req.method == method;
			};
		} else {
			fn = (req: ServerRequest) => {
				return req.url == url && req.method == method;
			};
		}

		return fn;
	}

	route(request: ServerRequest): Page {
		for (let [key, value] of this.routes) {
			if (key(request)) return value(request);
		}

		return new Page4XX(404);
	}
}
