import {serve, ServerRequest} from "https://deno.land/std@0.50.0/http/server.ts";
import {route, linkRoute} from "../Dendro/Routes/Router.ts";
import {HomePage} from "../Dendro/Pages/HomePage.ts"


const s = serve({port: 8000});
console.log("http://localhost:8000/");

let isHome = (req:ServerRequest) => req.url=="/"  

linkRoute(isHome, HomePage.Get)

for await (const req of s) {

    req.respond(route(req).getResponse());
}