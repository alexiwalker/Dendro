import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";
import { Page } from "../Pages/mod.ts";
import { PageProvider } from "../Dendro.ts";
import { RequestEnvironment } from "../Util/RequestEnvironment.ts";
import {MiddleWare} from "../Dendro.ts";
import {Route} from "./Route.ts";

export declare type RouteValidator = (request: ServerRequest) => boolean;
export declare type RouteMap = Map<RouteValidator, [PageProvider,MiddleWare[]]>;
export declare type RouteList = Array<Route>;
export declare type Router = IRouter;

export interface IRouter {
	RouteRequest(requestEnvironment: RequestEnvironment): Promise<Page>;
	addRoute(route:Route):void;
	routeList:RouteList;
}

