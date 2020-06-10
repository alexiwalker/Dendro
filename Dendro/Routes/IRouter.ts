import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";
import { Page } from "../Pages/mod.ts";
import { PageProvider } from "../Dendro.ts";
import { RequestEnvironment } from "../Util/RequestEnvironment.ts";
import {MiddleWare} from "../Dendro.ts";

export declare type RouteValidator = (request: ServerRequest) => boolean;
export declare type RouteMap = Map<RouteValidator, [PageProvider,MiddleWare[]]>;
export declare type Router = IRouter;

export interface IRouter {
	route(requestEnvironment: RequestEnvironment): Page;
	linkRoute(validator: RouteValidator, pager: PageProvider): void;
}
