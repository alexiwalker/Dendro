import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

import { Page, Page4XX } from "../Pages/mod.ts";

import { IRouter, RouteValidator, RouteMap } from "./IRouter.ts";

import { PageProvider } from "../Dendro.ts";

export class BasicRouter implements IRouter {
	routes: RouteMap = new Map<RouteValidator, PageProvider>();

	constructor() {}

	public linkRoute(validator: RouteValidator, pager: PageProvider): void {
		this.routes.set(validator, pager);
	}

	route(request: ServerRequest): Page {
		for (let [key, value] of this.routes) {
			if (key(request)) return value(request);
		}

		return new Page4XX(404);
	}
}
