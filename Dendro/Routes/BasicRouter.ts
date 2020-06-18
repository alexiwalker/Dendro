import {ServerRequest} from "https://deno.land/std@0.50.0/http/server.ts";

import {Page, Page4XX} from "../Pages/mod.ts";

import {IRouter, RouteList, RouteValidator} from "./IRouter.ts";

import {MiddleWare, PageProvider} from "../Dendro.ts";
import {RequestEnvironment} from "../Util/RequestEnvironment.ts";
import {Route} from "./Route.ts";

//for method-based routing
export const Post: string = "POST";
export const Put: string = "PUT";
export const Get: string = "GET";
export const Delete: string = "DELETE";

export class BasicRouter implements IRouter {
	routeList: RouteList = new Array<Route>();

	constructor() {
	}

	private static _method(url: string, checkParams: boolean = false, method: string): RouteValidator {
		let validator: RouteValidator;

		if (!checkParams) {
			validator = (req: ServerRequest) => {
				return req.url.split("?")[0] == url && req.method == method;
			};
		} else {
			validator = (req: ServerRequest) => {
				return req.url == url && req.method == method;
			};
		}

		return validator;
	}

	addRoute(route: Route): void {
		this.routeList.push(route)
	}

	public add(validator: RouteValidator, page: PageProvider, Middleware: MiddleWare[] = []): void {
		this.addRoute(new Route(validator, page, Middleware));
	}

	public url(url: string, page: PageProvider, checkParams: boolean = false, middleWare: MiddleWare[] = []): void {
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

		this.add(fn, page, middleWare);
	}

	public get(url: string, page: PageProvider, middleWare: MiddleWare[] = [], checkParams: boolean = false) {
		this.add(BasicRouter._method(url, checkParams, Get), page, middleWare);
	}

	public post(url: string, page: PageProvider, middleWare: MiddleWare[] = [], checkParams: boolean = false) {
		this.add(BasicRouter._method(url, checkParams, Post), page, middleWare);
	}

	public put(url: string, page: PageProvider, middleWare: MiddleWare[] = [], checkParams: boolean = false) {
		this.add(BasicRouter._method(url, checkParams, Put), page, middleWare);
	}

	public delete(url: string, page: PageProvider, middleWare: MiddleWare[] = [], checkParams: boolean = false) {
		this.add(BasicRouter._method(url, checkParams, Delete), page, middleWare);
	}

	async RouteRequest(requestEnvironment: RequestEnvironment): Promise<Page> {
		for (let route of this.routeList) {
			if (route.Validate(requestEnvironment)) {
				await route.ServeRoutedMiddleware(requestEnvironment)
				return route.pager(requestEnvironment);
			}
		}

		return new Page4XX(404);
	}
}
