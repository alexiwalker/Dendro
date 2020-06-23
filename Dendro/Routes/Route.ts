import {MiddleWare, PageProvider, ServerRequest} from "../Dendro.ts";
import {RouteValidator} from "./IRouter.ts";
import {RequestEnvironment} from "../Util/RequestEnvironment.ts";

export class Route {
	public pager: PageProvider;
	private _middleware: MiddleWare[] = [];
	private readonly _validator: RouteValidator;

	constructor(validator: RouteValidator, pager: PageProvider, middleWare: MiddleWare[] = []) {
		this.pager = pager;
		this._validator = validator;
		this._middleware = middleWare;
	}

	public static url(url: string, checkParams: boolean = false): RouteValidator {
		return (req: ServerRequest) => {
			if (!checkParams) {
				return req.url.split("?")[0] == url;
			} else {
				return req.url == url;
			}
		}
	}

	public AddMiddleWare(middleWare: MiddleWare): void {
		this._middleware.push(middleWare)
	}

	public SetMiddleWare(middleWare: MiddleWare[]): void {
		this._middleware = middleWare;
	}

	public Validate(env: RequestEnvironment): boolean {
		return this._validator(env.request)
	}

	public async ServeRoutedMiddleware(env: RequestEnvironment) {
		for (const fn of this._middleware) {
			await fn(env)
		}
	}

}