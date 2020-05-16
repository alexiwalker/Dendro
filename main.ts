import { Dendro, ServerRequest } from "./Dendro/Dendro.ts";
import { HomePage } from "./Dendro/Pages/HomePage.ts";

let App = new Dendro(8000);

let isHome = (req: ServerRequest) => req.url == "/";

App.linkRoute(isHome, HomePage.Get);

await App.Serve();
