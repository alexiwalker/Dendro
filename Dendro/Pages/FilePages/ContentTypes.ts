import {RouteValidator} from "../../Routes/IRouter.ts";
import {ServerRequest} from "../../Dendro.ts";
import {Page} from "../Page.ts";
import {MimeTypes} from "./Types/ServeAny.ts";



// Even though these are all grouped together under serverstaticdefaults, they have their own RouteValidators to
//      allow them to be routed and served individually
export var contentTypeJS: RouteValidator = (req: ServerRequest) => req.url.endsWith(".js");
export var contentTypeCSS: RouteValidator = (req: ServerRequest) => req.url.endsWith(".css");

// Attempt to find a file that has a known mime type
export var contentStaticWithKnownMime: RouteValidator = (req: ServerRequest) => MimeTypes.has("." + req.url.split(".").reverse()[0])

// if it has length>1 after splitting on "." then the last entry would be file type
export var contentWithoutKnownMime: RouteValidator = (req: ServerRequest) => req.url.split(".").length > 1;


export class ContentPage extends Page {
	public getResponse(): Object {
		throw new Error("Method not implemented.");
	}
}