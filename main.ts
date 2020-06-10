import {Dendro, ServerRequest, MiddleWare} from "./Dendro/Dendro.ts";
import {ConsoleLogger} from "./Dendro/Util/Log/ConsoleLogger.ts";
import {BasicRouter} from "./Dendro/Routes/mod.ts";
import {RequestEnvironment} from "./Dendro/Util/RequestEnvironment.ts";
import {DecodeBodyJSON} from "./Dendro/Middleware/Middleware.ts";
import {Env} from "./Dendro/Util/Env.ts";
import {HomePage} from "./Application/Pages/Home.ts";
import {StaticCSS} from "./Dendro/Pages/FilePages/Types/StaticCSS.ts";
import {contentTypeCSS, contentTypeJS} from "./Dendro/Pages/FilePages/ContentTypes.ts";
import {StaticJS} from "./Dendro/Pages/FilePages/Types/StaticJS.ts";
import {basicGet} from "./Dendro/Pages/ExamplePages.ts";

let PORT: number = Env.Port(8000, "PORT")

let App: Dendro = new Dendro(PORT);
let router: BasicRouter = new BasicRouter();
App.usesRouter(router);

router.url("/", HomePage.new, false, [
	(env: RequestEnvironment) => {
		App.log("Serving first route-specific middleware: " + env.request.url);
	},
	(env: RequestEnvironment) => {
		App.log("Serving Secondary route-specific middleware: " + env.request.method)
	},
	(env: RequestEnvironment) => {
		//this url, / , will now be routed by the page provider for /test instead of / even though it specifies HomePage.new
		//use case: conditional url rewriting  eg (if(somebodycontentcheck() == 1) url="/test"
		env.request.url="/test";
	     //throws in this context are safe and are handled by the default error handler
		throw new Error("Unknown Error")
	},
	(env: RequestEnvironment) => {
		App.log("This will never execute, as an error has been thrown above")
	},
])

router.url("/test", basicGet.new,)

router.linkRoute(contentTypeCSS, StaticCSS.new)
router.linkRoute(contentTypeJS, StaticJS.new)

App.usesMiddleware((env: RequestEnvironment) => {
	App.logger.Info(env.request.url);
});

App.usesMiddleware((env: RequestEnvironment) => {
	App.log("request completed");
}, Dendro.MiddlewareAfterRequest);


App.usesErrorHandler((error: Error) => {
	console.log("Handling error...");
});

App.usesLogger(new ConsoleLogger());

App.logAllErrors = true;

await App.Serve();
