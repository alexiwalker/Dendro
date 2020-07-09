import {serve, Server} from "https://deno.land/std@0.50.0/http/server.ts";

import {BasicRouter, IRouter} from "./Routes/mod.ts";

import {ConsoleLogger, ILogger} from "./Util/mod.ts";

import {Page, Page4XX, Page5XX} from "./Pages/mod.ts";
import {RequestEnvironment} from "./Util/RequestEnvironment.ts";

//As all RouteValidators and RoutePagers require ServerRequest, it is also exported here even if it is imported via other files
//Useful for 3rd parties working with Dendro, but not needed internalluy
// @ts-ignore
export {ServerRequest} from "https://deno.land/std@0.50.0/http/server.ts";

export declare type ErrorHandler = (error: Error, env: RequestEnvironment) => void;
export declare type PageProvider = (environment: RequestEnvironment) => Page;
export declare type StatusPageProvider = (status: number) => Page;
export declare type MiddleWare = (environment: RequestEnvironment) => void;

/**
 * Dendro is the server application which is called to add routes and routers, loggers, errorHandlers and templates
 */
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

	/**
	 * The logger currently used by the Dendro application
	 * Loggers implement ILogger
	 */
	public get logger(): ILogger {
		return this._logger as ILogger;
	}

	/**
	 * Gets the Array of MiddleWare functions that are executed prior to the routing of a request.
	 * These functions are able to affect the routing of the request
	 */
	public get middleWareBefore(): Array<MiddleWare> {
		return this.beforeRequest;
	}

	/**
	 * Gets the Array of MiddleWare functions that are executed after the request is responded to.
	 * These functions cannot affect the routing or response but can be used for diagnostic purposes.
	 */
	public get middleWareAfter(): Array<MiddleWare> {
		return this.afterRequest;
	}

	/**
	 * The Location of the static assets that can be served by the Dendro application.
	 * Returns the full system path, not the path relative to the project or application
	 */
	public static getAssetPath(): string {
		return Dendro.assetPath;
	}

	/**
	 * Takes a relative path and creates and stored an absolute path to the folder where static assets are stored
	 * @param path : string relative path for the assets folder.
	 */
	public static setAssetPath(path: string) {
		Dendro.assetPath = Deno.realPathSync(path);
	}

	/**
	 * Takes a relative path and creates and stored an absolute path to the folder where template files are stored
	 * @param path : string relative path for the template folder.
	 */
	public static setTemplatePath(path: string) {
		Dendro.templatePath = Deno.realPathSync(path);
	}

	/**
	 * The Location of the templates that are used by the Dendro application.
	 * Returns the full system path, not the path relative to the project or application
	 */
	public static getTemplatePath() {
		return Dendro.templatePath;
	}

	/**
	 * The Location of the static assets that can be served by the Dendro application.
	 * Returns the full system path, not the path relative to the project or application
	 */
	public getAssetPath() {
		return Dendro.getAssetPath()
	}

	/**
	 * The Location of the templates that are used by the Dendro application.
	 * Returns the full system path, not the path relative to the project or application
	 */
	public getTemplatePath() {
		return Dendro.templatePath;
	}

	/**
	 * Add a middleware function to either the Before- or After- request queues
	 * @param middleWare : MiddleWare function pointer to add
	 * @param order : number representing whether it as added to the before or after request queues.
	 *      Dendro.MiddlewareBeforeRequest to execute it before the request, Dendro.MiddlewareAfterRequest to execute it after the response is sent
	 */
	public usesMiddleware(middleWare: MiddleWare, order: number = Dendro.MiddlewareBeforeRequest) {
		if (order != Dendro.MiddlewareAfterRequest && order != Dendro.MiddlewareBeforeRequest) {
			throw new RangeError("Incorrect Setting for middlware order: use MiddlewareBeforeRequest or MiddlewareBeforeRequest");
		}

		order == Dendro.MiddlewareBeforeRequest ? this.beforeRequest.push(middleWare) : this.afterRequest.push(middleWare);
	}

	/**
	 * Serve the application; it will listen on the previously set port for requests.
	 * Each request will have its pre-request middleware served, then the request will be routed and a response generated by the resulting page.
	 * After the request it sent, any remaining middleware will be executed.
	 */
	public async Serve() {
		this.server = serve({port: this.port});
		if (this.server) {
			Dendro.logger.info("Serving on http://localhost:" + this.port.toString());


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

					req.respond((await this.router.routeRequest(env)).getResponse());

					for (let i = 0; i < this.afterRequest.length; i++) {
						await this.afterRequest[i](env);
					}
				} catch (error) {
					this.handleError(error, env);
					req.respond(this.onErrorPager(env).getResponse());
				}
			}

		}
	}

	/**
	 * Set the logger the application uses. it can be accessed in a static or object context.
	 * @param logger
	 */
	public usesLogger(logger: ILogger) {
		this._logger = logger;
		Dendro.logger = logger;
	}

	/**
	 * Sets the error handler, which will fire any time an error is fired but not caught.
	 * @param errorhandler
	 */
	public usesErrorHandler(errorhandler: ErrorHandler) {
		this.errorHandler = errorhandler;
	}

	/**
	 * Sets the router for the application
	 * @param router : IRouter object that implements route() which provides a page for the request given
	 */
	public usesRouter(router: IRouter) {
		this.router = router;
	}

	/**
	 * Logs a data with the default logger
	 * @param data
	 */
	public log(data: string) {
		this._logger?.log(data);
	}

	/**
	 * Set the page which will be called when an error is is thrown and caught by the application
	 * @param pageProvider
	 * @constructor
	 */
	public SetOnErrorPage(pageProvider: PageProvider) {
		this.onErrorPager = pageProvider;
	}

	/**
	 * Runs the error handler. If a logger is provided, and logAllErrors is enabled, the error will be logged and then handled.
	 * @param error : Error which is passed to the errorHandler
	 * @param env : RequestEnvironment which may be updated in response to the error
	 */
	private handleError(error: Error, env:RequestEnvironment) {
		if (this.logAllErrors) this._logger?.log(error);

		if (this.errorHandler != null) this.errorHandler(error,env);
		else {
			throw error;
		}
	}
}
