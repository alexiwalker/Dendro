import { Dendro, ServerRequest } from "./Dendro/Dendro.ts";
import { HomePage, ErrorPage } from "./Dendro/Pages/mod.ts";
import { ConsoleLogger } from "./Dendro/Util/Log/ConsoleLogger.ts";
import { BasicRouter } from "./Dendro/Routes/mod.ts";

let App: Dendro = new Dendro(8000);
let router: BasicRouter = new BasicRouter();

App.usesRouter(router);
let isHome = (req: ServerRequest) => req.url == "/";

let isError = (req: ServerRequest) => req.url == "/error";

router.linkRoute(isHome, HomePage.Get);
router.linkRoute(isError, ErrorPage.Get);
router.url("/urltest", HomePage.Get, true);
// router.url("/urltest", ErrorPage.Get, false);

App.usesErrorHandler((error: Error) => {
	console.log("Handling error...");
});

App.usesLogger(new ConsoleLogger());

App.logAllErrors(true);

await App.Serve();
