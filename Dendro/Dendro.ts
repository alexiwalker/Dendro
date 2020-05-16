import {
	serve,
	ServerRequest,
	Server,
} from "https://deno.land/std@0.50.0/http/server.ts";

import {
	Router,
	RouteMap,
	RouteValidator,
	RoutePager,
} from "./Routes/Router.ts";

export { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

export class Dendro {
	public port: number;
	public router: Router;
	public server: Server | null;

	constructor(port: number) {
		this.port = port;
		this.router = new Router();
		this.server = null;
	}

	linkRoute = (validator: RouteValidator, pager: RoutePager) =>
		this.router.linkRoute(validator, pager);

	/**
	 * Serve
	 */
	public async Serve() {
		this.server = serve({ port: this.port });
		if (this.server) {
			console.log("Serving on localhost:" + this.port.toString());
			for await (const req of this.server) {
				req.respond(this.router.route(req).getResponse());
			}
		}
	}
}
