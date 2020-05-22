// @ts-ignore
import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

// @ts-ignore
import { Page } from "../Pages/mod.ts";
// @ts-ignore
import { PageProvider } from "../Dendro.ts";

export declare type RouteValidator = (request: ServerRequest) => boolean;
export declare type RouteMap = Map<RouteValidator, PageProvider>;

export interface IRouter {
	route(request: ServerRequest): Page;
	// linkRoute(validator: RouteValidator, pager: PageProvider): void;
}
