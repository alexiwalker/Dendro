import { Dendro, ServerRequest } from "./Dendro/Dendro.ts";
import { HomePage, ErrorPage } from "./Dendro/Pages/mod.ts";
import { ConsoleLogger } from "./Dendro/Util/Log/ConsoleLogger.ts";
import { BasicRouter } from "./Dendro/Routes/mod.ts";

let App: Dendro = new Dendro(8000);
let router: BasicRouter = new BasicRouter();

App.uses(router);

let isHome = (req: ServerRequest) => req.url == "/";

let isError = (req: ServerRequest) => req.url == "/error";

router.linkRoute(isHome, HomePage.new);
router.linkRoute(isError, ErrorPage.new);
router.url("/urltest", HomePage.new, true);

App.uses((error: Error) => {
	console.log("Handling error...");
});

App.uses(new ConsoleLogger());

App.logAllErrors = true;

await App.Serve();
