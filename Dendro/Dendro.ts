import {serve, Server} from "https://deno.land/std@0.50.0/http/server.ts";

import {BasicRouter, IRouter} from "./Routes/mod.ts";

import {ConsoleLogger, ILogger} from "./Util/mod.ts";

import {Page, Page4XX, Page5XX} from "./Pages/mod.ts";
import {RequestEnvironment} from "./Util/RequestEnvironment.ts";

//As all RouteValidators and RoutePagers require ServerRequest, it is also exported here even if it is imported via other files
//Useful for 3rd parties working with Dendro, but not needed internalluy
// @ts-ignore
export {ServerRequest} from "https://deno.land/std@0.50.0/http/server.ts";

export declare type ErrorHandler = (error: Error) => void;
export declare type PageProvider = (environment: RequestEnvironment) => Page;
export declare type StatusPageProvider = (status: number) => Page;
export declare type MiddleWare = (environment: RequestEnvironment) => void;

export class Dendro {
	public static MiddlewareBeforeRequest: number = 0;
	public static MiddlewareAfterRequest: number = 1;
	public static logger: ILogger = new ConsoleLogger();
	public static assetPath: string = ""
	public static templatePath: string = ""
	public static Page400: StatusPageProvider = Page4XX.new;
	public static Page500: StatusPageProvider = Page5XX.new;
	public port: number;
	public router: IRouter;
	public server: Server | null;
	public logAllErrors: boolean;
	private errorHandler: ErrorHandler | null;
	private onErrorPager: PageProvider;
	private beforeRequest: MiddleWare[];
	private afterRequest: MiddleWare[];

	constructor(port: number) {
		this.port = port;
		this.router = new BasicRouter();
		this.server = null;
		this._logger = null;
		this.errorHandler = null;
		this.logAllErrors = false;
		this.onErrorPager = () => {
			return Dendro.Page500(500);
		};

		this.beforeRequest = [];
		this.afterRequest = [];

	}

	private _logger: ILogger | null;

	public get logger(): ILogger {
		return this._logger as ILogger;
	}

	public get middleWareBefore(): Array<MiddleWare> {
		return this.beforeRequest;
	}

	public get middleWareAfter(): Array<MiddleWare> {
		return this.afterRequest;
	}

	public static getAssetPath(): string {
		return Dendro.assetPath;
	}

	public static setAssetPath(path: string) {
		Dendro.assetPath = path;
	}

	public static setTemplatePath(path: string) {
		Dendro.templatePath = path;
	}

	public static getTemplatePath() {
		return Dendro.templatePath;
	}

	public getAssetPath() {
		return Dendro.getAssetPath()
	}

	public getTemplatePath() {
		return Dendro.templatePath;
	}

	public usesMiddleware(middleWare: MiddleWare, order: number = Dendro.MiddlewareBeforeRequest) {
		if (order != Dendro.MiddlewareAfterRequest && order != Dendro.MiddlewareBeforeRequest) {
			throw new RangeError("Incorrect Setting for middlware order: use MiddlewareBeforeRequest or MiddlewareBeforeRequest");
		}

		order == Dendro.MiddlewareBeforeRequest ? this.beforeRequest.push(middleWare) : this.afterRequest.push(middleWare);
	}

	/**
	 * Serve
	 */
	public async Serve() {
		this.server = serve({port: this.port});
		if (this.server) {
			Dendro.logger.Info("Serving on http://localhost:" + this.port.toString());

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

					req.respond((await this.router.RouteRequest(env)).getResponse());

					for (let i = 0; i < this.afterRequest.length; i++) {
						await this.afterRequest[i](env);
					}
				} catch (error) {
					this.handleError(error);
					req.respond(this.onErrorPager(env).getResponse());
				}
			}

		}
	}

	public usesLogger(logger: ILogger) {
		this._logger = logger;
		Dendro.logger = logger;
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

	public SetOnErrorPage(pageProvider: PageProvider) {
		this.onErrorPager = pageProvider;
	}

	private handleError(error: Error) {
		if (this.logAllErrors) this._logger?.Log(error);

		if (this.errorHandler != null) this.errorHandler(error);
		else {
			throw error;
		}
	}
}
