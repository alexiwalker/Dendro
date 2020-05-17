import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

import { Page } from "../Pages/Page.ts";
import { HomePage, Page404 } from "../Pages/HomePage.ts";

export declare type RouteValidator = (request: ServerRequest) => boolean;
import { PageProvider } from "../Dendro.ts";

export declare type RouteMap = Map<RouteValidator, PageProvider>;

export class Router {
	routes: RouteMap = new Map<RouteValidator, PageProvider>();

	constructor() {}

	public linkRoute(validator: RouteValidator, pager: PageProvider): void {
		this.routes.set(validator, pager);
	}

	route(request: ServerRequest): Page {
		for (let [key, value] of this.routes) {
			if (key(request)) return value(request);
		}

		return new Page404();
	}
}
