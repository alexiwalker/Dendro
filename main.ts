import { Dendro, ServerRequest, MiddleWare } from "./Dendro/Dendro.ts";
import { HomePage, ErrorPage } from "./Dendro/Pages/mod.ts";
import { ConsoleLogger } from "./Dendro/Util/Log/ConsoleLogger.ts";
import { BasicRouter } from "./Dendro/Routes/mod.ts";
import { RequestEnvironment } from "./Dendro/Util/RequestEnvironment.ts";
import { DecodeBodyJSON } from "./Dendro/Middleware/Middleware.ts";
import {Env} from "./Dendro/Util/Env.ts";

let PORT : number = Env.Port(8000,"PORT")

let App: Dendro = new Dendro(PORT);
let router: BasicRouter = new BasicRouter();

App.usesRouter(router);

let isHome = (req: ServerRequest) => req.url == "/";

let isError = (req: ServerRequest) => req.url == "/error";

//Default bundled Middleware: Decodes the request body as
App.usesMiddleware(DecodeBodyJSON);

//Example middleware: Rewrites any PUT requests to POST before they are routed
App.usesMiddleware(async (env: RequestEnvironment) => {
	if (env.request.method == "PUT") {
		env.request.method = "POST";
	}
}, Dendro.MiddlewareBeforeRequest);

App.usesMiddleware((env: RequestEnvironment) => {
	App.logger.Critical(env.request.url);
});

App.usesMiddleware((env: RequestEnvironment) => {
	App.log("request method after: " + env.request.method);
}, Dendro.MiddlewareAfterRequest);

router.linkRoute(isHome, HomePage.new);
router.linkRoute(isError, ErrorPage.new);
router.url("/urltest", HomePage.new, true);

App.usesErrorHandler((error: Error) => {
	console.log("Handling error...");
});

App.usesLogger(new ConsoleLogger());

App.logAllErrors = true;

await App.Serve();
