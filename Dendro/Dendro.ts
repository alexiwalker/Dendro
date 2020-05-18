import {
	serve,
	ServerRequest,
	Server,
} from "https://deno.land/std@0.50.0/http/server.ts";

// @ts-ignore
import { BasicRouter, RouteValidator, IRouter } from "./Routes/mod.ts";
import { ILogger } from "./Util/mod.ts";
import { Page5XX } from "./Pages/mod.ts";
import { Page } from "./Pages/mod.ts";

//As all RouteValidators and RoutePagers require ServerRequest, it is also exported here even if it is imported via other files
//Useful for 3rd parties working with Dendro, but not needed internalluy
export { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

export declare type ErrorHandler = (error: Error) => void;
export declare type PageProvider = (request: ServerRequest) => Page;

export class Dendro {
	// declare type ErrorHandler = (ex:Error):void;
	public port: number;
	public router: IRouter;
	public server: Server | null;
	private logger: ILogger | null;
	private errorHandler: ErrorHandler | null;
	private _logAllErrors: boolean;
	private onErrorPager: PageProvider;

	constructor(port: number) {
		this.port = port;
		this.router = new BasicRouter();
		this.server = null;
		this.logger = null;
		this.errorHandler = null;
		this._logAllErrors = false;
		this.onErrorPager = (req: ServerRequest) => {
			return new Page5XX(500);
		};
	}

	linkRoute = (validator: RouteValidator, pager: PageProvider) =>
		this.router.linkRoute(validator, pager);

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

	public log(data: string) {
		this.logger?.LogString(data);
	}

	private handleError(error: Error) {
		if (this._logAllErrors) this.logger?.LogString(error.message);

		if (this.errorHandler != null) this.errorHandler(error);
		else {
			throw Error;
		}
	}

	public logAllErrors(bool: boolean) {
		this._logAllErrors = bool;
	}

	public SetOnErrorPage(pageProvider: PageProvider) {
		this.onErrorPager = pageProvider;
	}
}
