import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

import { Page } from "../Pages/Page.ts";
import { PageProvider } from "../Dendro.ts";

export declare type RouteValidator = (request: ServerRequest) => boolean;
export declare type RouteMap = Map<RouteValidator, PageProvider>;

export interface IRouter {
	route(request: ServerRequest): Page;
	linkRoute(validator: RouteValidator, pager: PageProvider): void;
}
