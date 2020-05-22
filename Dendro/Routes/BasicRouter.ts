import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

import { Page, Page4XX } from "../Pages/mod.ts";

import { IRouter, RouteValidator, RouteMap } from "./IRouter.ts";

import { PageProvider } from "../Dendro.ts";

export class BasicRouter implements IRouter {
	routes: RouteMap = new Map<RouteValidator, PageProvider>();

	constructor() {}

	public linkRoute(validator: RouteValidator, page: PageProvider): void {
		this.routes.set(validator, page);
	}

	public url(url: string, page: PageProvider, checkParams: boolean = false): void {
		var fn: RouteValidator;

		if (!checkParams) {
			fn = (req: ServerRequest) => {
				if (req.url.split("?")[0] == url) return true;
				return false;
			};
		} else {
			fn = (req: ServerRequest) => {
				if (req.url == url) return true;
				return false;
			};
		}

		this.linkRoute(fn, page);
	}

	route(request: ServerRequest): Page {
		for (let [key, value] of this.routes) {
			if (key(request)) return value(request);
		}

		return new Page4XX(404);
	}
}
