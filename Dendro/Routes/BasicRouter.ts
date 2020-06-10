import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

import { Page, Page4XX } from "../Pages/mod.ts";

import { IRouter, RouteValidator, RouteMap } from "./IRouter.ts";

import {MiddleWare, PageProvider} from "../Dendro.ts";
import { RequestEnvironment } from "../Util/RequestEnvironment.ts";

//for method-based routing
export const Post: string = "POST";
export const Put: string = "PUT";
export const Get: string = "GET";
export const Delete: string = "DELETE";

export class BasicRouter implements IRouter {
	routes: RouteMap = new Map<RouteValidator, [PageProvider,MiddleWare[]]>();

	constructor() {}

	public linkRoute(validator: RouteValidator, page: PageProvider, Middleware:MiddleWare[] = []): void {
		this.routes.set(validator, [page,Middleware]);
	}

	public url(url: string, page: PageProvider, checkParams: boolean = false, middleWare:MiddleWare[] = []): void {
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

		this.linkRoute(fn, page, middleWare);
	}

	public get(url: string, page: PageProvider, checkParams: boolean = false,middleWare:MiddleWare[] = []) {
		this.linkRoute(BasicRouter._method(url, checkParams, Get), page,middleWare);
	}

	public post(url: string, page: PageProvider, checkParams: boolean = false,middleWare:MiddleWare[] = []) {
		this.linkRoute(BasicRouter._method(url, checkParams, Post), page,middleWare);
	}

	public put(url: string, page: PageProvider, checkParams: boolean = false,middleWare:MiddleWare[] = []) {
		this.linkRoute(BasicRouter._method(url, checkParams, Put), page,middleWare);
	}

	public delete(url: string, page: PageProvider, checkParams: boolean = false,middleWare:MiddleWare[] = []) {
		this.linkRoute(BasicRouter._method(url, checkParams, Delete), page,middleWare);
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

	route(requestEnvironment: RequestEnvironment): Page {
		for (let [key, value] of this.routes) {
			if (key(requestEnvironment.request)){
				for(var ware of value[1]){
					ware(requestEnvironment)
				}
				return value[0](requestEnvironment);
			}
		}

		return new Page4XX(404);
	}
}
