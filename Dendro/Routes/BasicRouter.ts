import {ServerRequest} from "https://deno.land/std@0.50.0/http/server.ts";

import {Page, Page4XX} from "../Pages/mod.ts";

import {IRouter, RouteList, RouteValidator} from "./IRouter.ts";

import {MiddleWare, PageProvider} from "../Dendro.ts";
import {RequestEnvironment} from "../Util/RequestEnvironment.ts";
import {Route} from "./Route.ts";
import {contentTypeAny, contentTypeCSS, contentTypeImage, contentTypeJS} from "../Pages/FilePages/ContentTypes.ts";
import {StaticCSS} from "../Pages/FilePages/Types/StaticCSS.ts";
import {StaticJS} from "../Pages/FilePages/Types/StaticJS.ts";
import {StaticImage} from "../Pages/FilePages/Types/StaticImage.ts";
import {StaticAny} from "../Pages/FilePages/Types/ServeAny.ts";

//for method-based routing
export const Post: string = "POST";
export const Put: string = "PUT";
export const Get: string = "GET";
export const Delete: string = "DELETE";

/**
 * A router that implements a simple list of routes which are iterated over until a matching one can be found
 * offers default handling for many common types of routing.
 * Eg
 * url("/",HomePage.new) will route any url matching "/" to the page provide by HomePage.new
 * post("/",HomePage.new, JsonBodyDecode) will route any url matching "/" to the HomePage.new page, but will also use
 *      the default JsonBodyDecode middleware to update the RequestEnvironment with the decoded Object
 */
export class BasicRouter implements IRouter {
	routeList: RouteList = new Array<Route>();

	constructor() {
	}

	private static _method(url: string, checkParams: boolean = false, method: string): RouteValidator {
		let validator: RouteValidator;

		if (!checkParams) {
			validator = (req: ServerRequest) => {
				return req.url.split("?")[0] == url && req.method == method;
			};
		} else {
			validator = (req: ServerRequest) => {
				return req.url == url && req.method == method;
			};
		}

		return validator;
	}

	/**
	 * Add a Route object to the Router. it will be placed at the end of the List.
	 * @param route : Route object to be added.
	 */
	addRoute(route: Route): void {
		this.routeList.push(route)
	}

	/**
	 * Crate a route based on a RouteValidator function
	 * @param validator : RouteValidator function that will return True if the request is to be used for that route
	 * @param page : PageProvider function that returns an object that inherits from Page, which will be used to generate the response
	 * @param middleWare : MiddleWare[] that will be executed prior to the Page being created.
	 */
	public add(validator: RouteValidator, page: PageProvider, middleWare: MiddleWare[] = []): void {
		this.addRoute(new Route(validator, page, middleWare));
	}

	/**
	 * Create a route based on a URL match
	 * @param url : string URL to be checked against
	 * @param page : PageProvider function that returns an object that inherits from Page, which will be used to generate the response
	 * @param checkParams : boolean to control whether URL-encoded params will affect the route.
	 *      Default: false (/page&abc=123 and /page WILL be treated the same)
	 * @param middleWare : MiddleWare[] that will be executed prior to the Page being created.
	 */
	public url(url: string, page: PageProvider, checkParams: boolean = false, middleWare: MiddleWare[] = []): void {
		let fn: RouteValidator;

		if (!checkParams) {
			fn = (req: ServerRequest) => {
				return req.url.split("?")[0] == url;
			};
		} else {
			fn = (req: ServerRequest) => {
				return req.url == url;
			};
		}

		this.add(fn, page, middleWare);
	}

	/**
	 * Create a route for a specific URL when the request type is GET
	 * @param url : string URL to be checked against
	 * @param page : PageProvider function that returns an object that inherits from Page, which will be used to generate the response
	 * @param middleWare : MiddleWare[] that will be executed prior to the Page being created.
	 * @param checkParams : boolean to control whether URL-encoded params will affect the route.
	 *      Default: false (/page&abc=123 and /page WILL be treated the same)
	 *      Alternate: true  (/page&abc=123 and /page WILL NOT be treated the same)
	 */
	public get(url: string, page: PageProvider, middleWare: MiddleWare[] = [], checkParams: boolean = false) {
		this.add(BasicRouter._method(url, checkParams, Get), page, middleWare);
	}

	/**
	 * Create a route for a specific URL when the request type is POST
	 * @param url : string URL to be checked against
	 * @param page : PageProvider function that returns an object that inherits from Page, which will be used to generate the response
	 * @param middleWare : MiddleWare[] that will be executed prior to the Page being created.
	 * @param checkParams : boolean to control whether URL-encoded params will affect the route.
	 *      Default: false (/page&abc=123 and /page WILL be treated the same)
	 *      Alternate: true  (/page&abc=123 and /page WILL NOT be treated the same)
	 */
	public post(url: string, page: PageProvider, middleWare: MiddleWare[] = [], checkParams: boolean = false) {
		this.add(BasicRouter._method(url, checkParams, Post), page, middleWare);
	}

	/**
	 * Create a route for a specific URL when the request type is PUT
	 * @param url : string URL to be checked against
	 * @param page : PageProvider function that returns an object that inherits from Page, which will be used to generate the response
	 * @param middleWare : MiddleWare[] that will be executed prior to the Page being created.
	 * @param checkParams : boolean to control whether URL-encoded params will affect the route.
	 *      Default: false (/page&abc=123 and /page WILL be treated the same)
	 *      Alternate: true  (/page&abc=123 and /page WILL NOT be treated the same)
	 */
	public put(url: string, page: PageProvider, middleWare: MiddleWare[] = [], checkParams: boolean = false) {
		this.add(BasicRouter._method(url, checkParams, Put), page, middleWare);
	}

	/**
	 * Create a route for a specific URL when the request type is DELETE
	 * @param url : string URL to be checked against
	 * @param page : PageProvider function that returns an object that inherits from Page, which will be used to generate the response
	 * @param middleWare : MiddleWare[] that will be executed prior to the Page being created.
	 * @param checkParams : boolean to control whether URL-encoded params will affect the route.
	 *      Default: false (/page&abc=123 and /page WILL be treated the same)
	 *      Alternate: true  (/page&abc=123 and /page WILL NOT be treated the same)
	 */
	public delete(url: string, page: PageProvider, middleWare: MiddleWare[] = [], checkParams: boolean = false) {
		this.add(BasicRouter._method(url, checkParams, Delete), page, middleWare);
	}

	/**
	 * Take a RequestEnvironment object and test it against existing Route objects until one returns true.
	 * Once a valid Route is found, serve any MiddleWare linked to that Route
	 * Then, return the Page object created by its PageProvider function
	 *
	 * If no valid Routes are found, it returns a Page4XX with the 404 status code
	 * @param requestEnvironment
	 * @constructor
	 */
	async RouteRequest(requestEnvironment: RequestEnvironment): Promise<Page> {
		for (let route of this.routeList) {
			if (route.Validate(requestEnvironment)) {
				await route.ServeRoutedMiddleware(requestEnvironment)
				return route.pager(requestEnvironment);
			}
		}

		return new Page4XX(404);
	}

	/**
	 * Adds default static file handling for requests where the URL ends with .css, .js, or standard image types.
	 * A file with an extension that is not listed will be served with no content-type headers as a uint8 array and its original file name
	 */
	public addStaticDefaults():BasicRouter {
		this.add(contentTypeCSS, StaticCSS.new);
		this.add(contentTypeJS, StaticJS.new);
		this.add(contentTypeImage, StaticImage.new)
		this.add(contentTypeAny, StaticAny.new)
		return this;
	}
}
