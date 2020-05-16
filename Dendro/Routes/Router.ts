import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

import { Page } from "../Pages/Page.ts";
import { HomePage, Page404 } from "../Pages/HomePage.ts";

export declare type RouteValidator = (request: ServerRequest) => boolean;
export declare type RoutePager = (request: ServerRequest) => Page;

export declare type RouteMap = Map<RouteValidator, RoutePager>;

export class Router {
	routes: RouteMap = new Map<RouteValidator, RoutePager>();

	constructor() {}

	public linkRoute(validator: RouteValidator, pager: RoutePager): void {
		this.routes.set(validator, pager);
	}

	route(request: ServerRequest): Page {
		for (let [key, value] of this.routes) {
			if (key(request)) return value(request);
		}

		return new Page404();
	}
}
