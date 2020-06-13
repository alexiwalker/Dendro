import {Dendro} from "./Dendro/Dendro.ts";
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
import {Route} from "./Dendro/Routes/Route.ts";

//8000 if no env[PORT}, otherwise use env value
let PORT: number = Env.Port(8000, "PORT")

let App: Dendro = new Dendro(PORT);
let router: BasicRouter = new BasicRouter();
App.usesRouter(router);


//todo: works well enough but kinda ugly. Refactor to smooth this section out a bit but still use the Route object approach
router.addRoute(new Route(Route.url("/testroute"), HomePage.new))


router.addRoute(new Route(Route.url("/"), HomePage.new, [
	(env: RequestEnvironment) => {
		App.log("Serving first route-specific middleware: " + env.request.url);
	},
	DecodeBodyJSON
]))

router.url("/test", basicGet.new)

router.addRoute(new Route(contentTypeCSS, StaticCSS.new))
router.addRoute(new Route(contentTypeJS, StaticJS.new))

App.usesMiddleware((env: RequestEnvironment) => {
	App.log("Pre Request: ")
	App.logger.Info(env.request.url);
});

App.usesMiddleware((env: RequestEnvironment) => {
	App.log("request completed");
}, Dendro.MiddlewareAfterRequest);


App.usesErrorHandler((error: Error) => {
	App.log("Handling error...");
});

App.usesLogger(new ConsoleLogger());

App.logAllErrors = true;

await App.Serve();
