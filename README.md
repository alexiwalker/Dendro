# Dendro
A flexible web framework for the Deno Typescript runtime

### About

A dendro application has 3 main components: The Dendro object itself, A router object (implementing IRouter), A logger object (implementing ILogger), any number of object inheriting from Page

A router takes a RequestEnvironment and returns a page. A RequestEnvironment (RE from here-on) includes the request itself and other data about that request. After the page is returned, it generates the response.

This response is an object with a string body and headers are provided as a Map<string,string> of keys and values. This response is processed by the deno runtime and sent to the client.



### Routes


The default router (BasicRouter) can have routes added in a number of ways.

Routes consist generally of two parts: A function that takes the RE and returns a boolean value, and another that takes the RE and returns a Page object

The BasicRouter has a number of methods to simplify this process. For example:

    let router = new BasicRouter()
    router.get("/home",homePage.new)
    
If the request url matches "/home", it will call the function homePage.new and then the page returned will be executed to get a HTTP response.
Note that this does not use the classes constructor (EG, it does not call  `new homePage()` as this does not currently support Types as arguments)

Other similar methods are available for post,put and delete, aswell as the generic `router.url("/",page.new)` which will match for any of GET,PUT,POST,DELETE

Also available is the ability to add middleware functions to a route, which are functions that take a RE and return nothing, but can modify the RE in the process.

    let middleware = (requestEnvironment: RequestEnvironment) => {
        console.log(requestEnvironment.request.url)
    },
    
    router.url("/somePage",homePage.new,[middleware])
    
This would create a function that would log the requests URL to the console every time `/somePage` url was accessed, and then generate the response as normal.


Route objects can also be created directly by providing a validation function 
`RouteValidator = (request: ServerRequest) => boolean;`
and a page creation function `PageProvider = (environment: RequestEnvironment) => Page;`.

Additionally, an array of middleware `MiddleWare = (environment: RequestEnvironment) => void;` can also be added.
 
This can then be added to the BasicRouter with  `router.addRoute(route)`
 
Custom routers can be implemented and attatched to the Dendro object. The only requirement is to implement `RouteRequest(requestEnvironment: RequestEnvironment): Promise<Page>;`
 
BasicRouter supports serving static files out of the box. To enable, run `Dendro.setAssetPath("Application/Assets");`
where "Application/Assets" is the folder containting any static files 
and then run `router.addStaticDefaults()` to add the related routes.

For this purpose, any url ending with a file extension will be served statically (eg, `/robots.txt`, `/logo.png` will be served this way. `/robots` and `/logo` would not)
 
### Templates

Dendro uses mustache.js under the hood for templating.

To setup templating, add the directory of your template files relative to the project route.

`Dendro.setTemplatePath("Application/Templates");`

to use them, the Template is created inside the Page's getResponse function and Render is called with a json object.

    import {Template} from "../../Dendro/Templates/Template.ts";
    ....
	let bodycontent = Template.CreateSync("/template.html").Render({var:"some content"})
	return {body: bodycontent, status: 200};
	
Refer to the mustache.JS docs for further information about the templating syntax

###Errors

By default, any request for which no matching route can be found will generate a 404 response.
Any request during which an error is thrown but not caught by the associated Page or middleware will return a 500 exception

####Custom error pages

400 and 500 range pages can be overridden by setting the Dendro static variables

`public static Page400: StatusPageProvider = Page4XX.new;`
 
 and
  
`public static Page500: StatusPageProvider = Page5XX.new;`

to any `StatusPageProvider = (status: number) => Page;` function

#### Handling errors
An errorHandler is defined by the signature `ErrorHandler = (error: Error, env: RequestEnvironment) => void;`

An errorHandler can be set on a Dendro object and will be run whenever an error is not caught by the router or page.
    
    let app: Dendro = new Dendro(PORT);
    app.usesErrorHandler((e: Error, env:RequestEnvironment) => {
	    App.logger.Error(`A request ${env.url} threw an an error: ${e.message}`)
    })

After the executing the errorHandler, the default Page500 - as detailed above - will be executed to provide a response to the client.

`app.logAllErrors = true;` can be set to automatically log any errors that are thrown to the `error()` method of the currently set logger.


### Logging

A logger implements the ILogger interface available at `import {ILogger} from "./Log/mod.ts";` and has the foppllowing methods:
	
	Log(data: string): void;

	Info(data: string): void;

	Warning(data: string): void;

	Error(data: string): void;

	Critical(data: string): void;

	Debug(data: string): void;

The logger, when set, is available directly through a Dendro object or statically, so the same logger can be utilised from any scope - even if a Dendro object is not immediately available

By default, Dendro uses a console logger. However, a file or database style of logging is recommended as required by the specific application.

### Example minimal application
an example minimal application could be created and run as such:

    let PORT: number = Env.Port(8000, "PORT")
    
    let App: Dendro = new Dendro(PORT);
    let router: BasicRouter = new BasicRouter();
    App.usesRouter(router);
    
    Dendro.setAssetPath("Application/Assets");
    router.addStaticDefaults()
    await App.Serve();

This would serve any files placed in "Application/Assets". Any other requests would return a 404 response.
=======

--todo: rewriting this now that I have a better idea of how it will be structured

