import {ServerRequest} from "https://deno.land/std@0.50.0/http/server.ts";
import {Page} from "../Pages/mod.ts";
import {RequestEnvironment} from "../Util/RequestEnvironment.ts";
import {Route} from "./Route.ts";

export declare type RouteValidator = (request: ServerRequest) => boolean;
export declare type RouteList = Array<Route>;
export declare type Router = IRouter;

//A router will receive a RequestEnvironment and return a Page
//This occurs after the pre-request middleware, so any changes made to the environment or request
//in the pre-request middleware stage can affect the page returned (eg, changes made to request methods or urls)
export interface IRouter {

	//Page returned based on the contents of the RequestEnvironment and/or the Request object within.
	//impl as async

	RouteRequest(requestEnvironment: RequestEnvironment): Promise<Page>;
}

