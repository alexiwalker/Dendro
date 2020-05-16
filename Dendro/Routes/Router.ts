import {ServerRequest} from "https://deno.land/std@0.50.0/http/server.ts";

import {Page} from "../Pages/Page.ts";
import {HomePage, Page404} from "../Pages/HomePage.ts";

declare type RouteValidator = (request: ServerRequest) => boolean;
declare type RoutePager = (request: ServerRequest) => Page;

var routes: Map<RouteValidator, RoutePager> = new Map<RouteValidator,
    RoutePager>();

export function linkRoute(validator: RouteValidator, pager: RoutePager): void {
    routes.set(validator, pager);
}

export function route(request: ServerRequest): Page {
    for (let [key, value] of routes) {
        if (key(request)) return value(request);
    }

    return new Page404();
}
