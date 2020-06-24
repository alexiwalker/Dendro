import {Dendro} from "./Dendro/Dendro.ts";
import {ConsoleLogger} from "./Dendro/Util/Log/ConsoleLogger.ts";
import {BasicRouter} from "./Dendro/Routes/mod.ts";
import {DecodeBodyJSON} from "./Dendro/Middleware/Middleware.ts";
import {Env} from "./Dendro/Util/Env.ts";
import {HomePage, TemplatedHomePage} from "./Application/Pages/Home.ts";

import {Route} from "./Dendro/Routes/Route.ts";


//8000 if no env[PORT}, otherwise use env value
let PORT: number = Env.Port(8000, "PORT")

let App: Dendro = new Dendro(PORT);
let router: BasicRouter = new BasicRouter();
App.usesRouter(router);

Dendro.setAssetPath(Deno.env.get("ASSETS") as string);
Dendro.setTemplatePath(Deno.env.get("TEMPLATES") as string);

router.addStaticDefaults()

router.add(Route.url("/"), HomePage.new, [
	//An example of inline declared middledware
	() => {
		Dendro.logger.Info("Home Page accessed")
	},
	//An example of a pre-existing function included as middleware
	DecodeBodyJSON
]);

router.url("/template", TemplatedHomePage.new)

App.usesErrorHandler((e: Error) => {
	App.logger.Error(e.message)
})

App.usesLogger(new ConsoleLogger());

App.logAllErrors = true;

await App.Serve();
