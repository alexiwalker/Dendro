import {RouteValidator} from "../../Routes/IRouter.ts";
import {ServerRequest} from "../../Dendro.ts";
import {Page} from "../Page.ts";
import {ImageTypes} from "./Types/StaticImage.ts";

export var contentTypeJS: RouteValidator = (req: ServerRequest) => req.url.endsWith(".js");
export var contentTypeCSS: RouteValidator = (req: ServerRequest) => req.url.endsWith(".css");
export var contentTypeImage: RouteValidator = (req: ServerRequest) => ImageTypes.has("." + req.url.split(".").reverse()[0])

// if it has length>1 after splitting on "." then the last entry would be file type
export var contentTypeAny: RouteValidator = (req: ServerRequest) => req.url.split(".").length > 1;


export class ContentPage extends Page {
	public getResponse(): Object {
		throw new Error("Method not implemented.");
	}
}