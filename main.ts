import { Dendro, ServerRequest } from "./Dendro/Dendro.ts";
import { HomePage, ErrorPage } from "./Dendro/Pages/mod.ts";
import { ConsoleLogger } from "./Dendro/Util/Log/ConsoleLogger.ts";

let App = new Dendro(8000);

let isHome = (req: ServerRequest) => req.url == "/";

let isError = (req: ServerRequest) => req.url == "/error";

App.linkRoute(isHome, HomePage.Get);
App.linkRoute(isError, ErrorPage.Get);

App.usesErrorHandler((error: Error) => {
	console.log("Handling error...");
});

App.usesLogger(new ConsoleLogger());

App.logAllErrors(true);

await App.Serve();
