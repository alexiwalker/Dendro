// @ts-ignore
import { serve, ServerRequest, Server } from "https://deno.land/std@0.50.0/http/server.ts";

// @ts-ignore
import { BasicRouter, RouteValidator, IRouter, Router } from "./Routes/mod.ts";

// @ts-ignore
import { ILogger, Logger } from "./Util/mod.ts";

// @ts-ignore
import { Page5XX, Page } from "./Pages/mod.ts";
import { RequestEnvironment } from "./Util/RequestEnvironment.ts";

//As all RouteValidators and RoutePagers require ServerRequest, it is also exported here even if it is imported via other files
//Useful for 3rd parties working with Dendro, but not needed internalluy
// @ts-ignore
export { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

export declare type ErrorHandler = (error: Error) => void;
export declare type PageProvider = (environment: RequestEnvironment) => Page;
export declare type MiddleWare = (environment: RequestEnvironment) => void;

export declare type usable = Logger | Router | ErrorHandler;

export class Dendro {
	// declare type ErrorHandler = (ex:Error):void;
	public port: number;
	public router: IRouter;
	public server: Server | null;
	public logAllErrors: boolean;
	private _logger: ILogger | null;
	private errorHandler: ErrorHandler | null;
	private onErrorPager: PageProvider;

	private beforeRequest: MiddleWare[];
	private afterRequest: MiddleWare[];

	public static MiddlewareBeforeRequest: number = 0;
	public static MiddlewareAfterRequest: number = 1;

	constructor(port: number) {
		this.port = port;
		this.router = new BasicRouter();
		this.server = null;
		this._logger = null;
		this.errorHandler = null;
		this.logAllErrors = false;
		this.onErrorPager = (env: RequestEnvironment) => {
			return new Page5XX(500);
		};

		this.beforeRequest = [];
		this.afterRequest = [];
	}

	public usesMiddleware(middleWare: MiddleWare, order: number = Dendro.MiddlewareBeforeRequest) {
		if (order != Dendro.MiddlewareAfterRequest && order != Dendro.MiddlewareBeforeRequest) {
			throw new RangeError("Incorrect Setting for middlware order: use MIDDLEWARE_BEFORE or MIDDLEWARE_AFTER");
		}

		order == Dendro.MiddlewareBeforeRequest ? this.beforeRequest.push(middleWare) : this.afterRequest.push(middleWare);
	}

	linkRoute(validator: RouteValidator, pager: PageProvider) {
		if (this.router instanceof BasicRouter) {
			let router = this.router as BasicRouter;
			router.linkRoute(validator, pager);
		} else {
			throw new TypeError(
				"method linkRoute is only available for BasicRouter. Routes must be added to custom routers via the router object, not through a Dendro object"
			);
		}
	}

	public get(url: string, page: PageProvider, checkParams: boolean = false) {
		if (this.router instanceof BasicRouter) {
			let router = this.router as BasicRouter;
			router.get(url, page, checkParams);
		} else {
			throw new TypeError(
				"method 'get' is only available for the default DendroRouter. Routes must be added to custom routers via the router object, not through a Dendro object"
			);
		}
	}

	public post(url: string, page: PageProvider, checkParams: boolean = false) {
		if (this.router instanceof BasicRouter) {
			let router = this.router as BasicRouter;
			router.post(url, page, checkParams);
		} else {
			throw new TypeError(
				"method 'post' is only available for the default DendroRouter. Routes must be added to custom routers via the router object, not through a Dendro object"
			);
		}
	}

	public put(url: string, page: PageProvider, checkParams: boolean = false) {
		if (this.router instanceof BasicRouter) {
			let router = this.router as BasicRouter;
			router.put(url, page, checkParams);
		} else {
			throw new TypeError(
				"method 'put' is only available for the default DendroRouter. Routes must be added to custom routers via the router object, not through a Dendro object"
			);
		}
	}

	public delete(url: string, page: PageProvider, checkParams: boolean = false) {
		if (this.router instanceof BasicRouter) {
			let router = this.router as BasicRouter;
			router.delete(url, page, checkParams);
		} else {
			throw new TypeError(
				"method 'delete' is only available for the default DendroRouter. Routes must be added to custom routers via the router object, not through a Dendro object"
			);
		}
	}

	/**
	 * Serve
	 */
	public async Serve() {
		this.server = serve({ port: this.port });
		if (this.server) {
			console.log("Serving on localhost:" + this.port.toString());

			/////////////////////////////////////

			for await (const req of this.server) {
				let env: RequestEnvironment = new RequestEnvironment(req, this);

				try {
					//Serve generic pre-request middleware
					for (let i = 0; i < this.beforeRequest.length; i++) {
						//despite VSC saying await has no effect here, it actually can
						//because the FN pointer may be async; if it throws and no await, the error wont be caught
						//and the program will crash
						await this.beforeRequest[i](env);
					}

					//Serve Route-specific middleware
					// var routeMap = this.router.routes;
					// for (let [key, value] of routeMap) {
					// 	//value = [PageProvider,MiddleWare[]]
					// 	if (key(env.request)){
					// 		for(var middleware of value[1]){
					// 			await middleware(env)
					// 		}
					// 	}
					// }

					req.respond((await this.router.RouteRequest(env)).getResponse());

					for (let i = 0; i < this.afterRequest.length; i++) {
						//await: same as beforeRequest
						await this.afterRequest[i](env);
					}
				} catch (error) {
					this.handleError(error);
					req.respond(this.onErrorPager(env).getResponse());
				}
			}

			/////////////////////////////////////
		}
	}

	public usesLogger(logger: ILogger) {
		this._logger = logger;
	}

	public usesErrorHandler(errorhandler: ErrorHandler) {
		this.errorHandler = errorhandler;
	}

	public usesRouter(router: IRouter) {
		this.router = router;
	}

	public log(data: string) {
		this._logger?.Log(data);
	}

	private handleError(error: Error) {
		if (this.logAllErrors) this._logger?.Log(error);

		if (this.errorHandler != null) this.errorHandler(error);
		else {
			throw Error;
		}
	}

	public SetOnErrorPage(pageProvider: PageProvider) {
		this.onErrorPager = pageProvider;
	}

	public get middleWareBefore(): Array<MiddleWare> {
		return this.beforeRequest;
	}

	public get middleWareAfter(): Array<MiddleWare> {
		return this.afterRequest;
	}

	public get logger(): ILogger {
		return this._logger as ILogger;
	}
}
