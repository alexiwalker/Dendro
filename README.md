# Dendro
A framework for the Deno typescript  webruntime

This is my first time using Typescript. Probably doing stuff wrong for both TS and Deno, but... not like anybody will read this anyway.


### Pages

Any pages you write extend the Page class (Dendro/Pages/Page.ts) and requires you to implement the getResponse method, which is called on all pages to render them. This typically includes any HTML or JSON you are returning

Two example pages can be found at Dendro/Pages/HomePage.ts, including a basic home page showing which Method (get, post, etc) was used to access that page, and a basic 404 page that returns a basic "404"  body with a 404 status code.

The entry point for any page's business logic will be either in the constructor or the getResponse method


### Routes

a simple router is available at Dendro/Routes/Router.ts

It is used by providing two function pointers to linkRoute()

the function pointers are of types:

RouteValidator = (request: ServerRequest) => boolean;

RoutePager = (request: ServerRequest) => Page;

The RouteValidator is a test to determine if the server request matches the requirements for the page, and the RoutePager is any function that takes a server request and returns a page. 

Example usage:

    let App = new Dendro(8000);

    let isHome = (req: ServerRequest) => req.url == "/";

    App.linkRoute(isHome, HomePage.Get);
    
HomePage.get is a static function on the HomePage class that accesses its private constructor to provide the page, and the isHome function simply tests if the url accessed has nothing following it. There are no requirements for how a route is validated, but they are evaluated in the other in which they are added.
