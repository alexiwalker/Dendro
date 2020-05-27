// @ts-ignore
import { serve, ServerRequest, Server } from "https://deno.land/std@0.50.0/http/server.ts";

// @ts-ignore
import { BasicRouter, RouteValidator, IRouter, Router } from "./Routes/mod.ts";

// @ts-ignore
import { ILogger, Logger } from "./Util/mod.ts";

// @ts-ignore
import { Page5XX, Page } from "./Pages/mod.ts";

//As all RouteValidators and RoutePagers require ServerRequest, it is also exported here even if it is imported via other files
//Useful for 3rd parties working with Dendro, but not needed internalluy
// @ts-ignore
export { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

export declare type ErrorHandler = (error: Error) => void;
export declare type PageProvider = (request: ServerRequest) => Page;

export declare type usable = Logger | Router | ErrorHandler;

declare type _methodRoute = (url: string, page: PageProvider, checkParams: boolean) => void;

export class Dendro {
	// declare type ErrorHandler = (ex:Error):void;
	public port: number;
	public router: IRouter;
	public server: Server | null;
	public logAllErrors: boolean;
	private logger: ILogger | null;
	private errorHandler: ErrorHandler | null;
	private onErrorPager: PageProvider;

	constructor(port: number) {
		this.port = port;
		this.router = new BasicRouter();
		this.server = null;
		this.logger = null;
		this.errorHandler = null;
		this.logAllErrors = false;
		this.onErrorPager = (req: ServerRequest) => {
			return new Page5XX(500);
		};
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
			for await (const req of this.server) {
				try {
					req.respond(this.router.route(req).getResponse());
				} catch (error) {
					this.handleError(error);
					req.respond(this.onErrorPager(req).getResponse());
				}
			}
		}
	}

	public usesLogger(logger: ILogger) {
		this.logger = logger;
	}

	public usesErrorHandler(errorhandler: ErrorHandler) {
		this.errorHandler = errorhandler;
	}

	public usesRouter(router: IRouter) {
		this.router = router;
	}

	public uses(arg: usable) {
		try {
			if (typeof arg === typeof ((error: ErrorHandler) => void {})) {
				this.errorHandler = arg as ErrorHandler;
			} else {
				//I hate everything about this.
				//and if someone extends these and doesnt include the implements properly?

				//...

				//...

				//fuck

				//maybe i should use Router/Logger as base classes and not interfaces, so that i can implement it properly there

				let usable = arg as IRouter | ILogger;

				if (usable.implements.includes("IRouter")) {
					this.router = arg as IRouter;
				}

				if (usable.implements.includes("ILogger")) {
					this.logger = arg as ILogger;
				}
			}
		} catch (e) {
			console.log(e.message);
			return;
		}
	}

	public log(data: string) {
		this.logger?.LogString(data);
	}

	private handleError(error: Error) {
		if (this.logAllErrors) this.logger?.LogString(error.message);

		if (this.errorHandler != null) this.errorHandler(error);
		else {
			throw Error;
		}
	}

	public SetOnErrorPage(pageProvider: PageProvider) {
		this.onErrorPager = pageProvider;
	}
}
