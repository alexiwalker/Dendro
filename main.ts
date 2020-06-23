import {Dendro} from "./Dendro/Dendro.ts";
import {ConsoleLogger} from "./Dendro/Util/Log/ConsoleLogger.ts";
import {BasicRouter} from "./Dendro/Routes/mod.ts";
import {DecodeBodyJSON} from "./Dendro/Middleware/Middleware.ts";
import {Env} from "./Dendro/Util/Env.ts";
import {HomePage} from "./Application/Pages/Home.ts";

import {Route} from "./Dendro/Routes/Route.ts";


//8000 if no env[PORT}, otherwise use env value
let PORT: number = Env.Port(8000, "PORT")

let App: Dendro = new Dendro(PORT);
let router: BasicRouter = new BasicRouter();
App.usesRouter(router);

//setting a route from the validation tests
App.setAssetPath("C:\\Users\\alex\\Projects\\WebStormProjects\\Atrius\\Application\\Assets\\");
App.setTemplatePath("C:\\Users\\alex\\Projects\\WebStormProjects\\Atrius\\Application\\Templates");

router.addStaticDefaults()


//above, but with some added middleware
router.add(Route.url("/"), HomePage.new, [()=>{

},
	DecodeBodyJSON
]);


App.usesErrorHandler((e:Error)=>{
	App.logger.Error(e.message)
})

App.usesLogger(new ConsoleLogger());

App.logAllErrors = true;

await App.Serve();
