import {RouteValidator} from "../../Routes/IRouter.ts";
import {ServerRequest,PageProvider} from "../../Dendro.ts";
import {RequestEnvironment} from "../../Util/RequestEnvironment.ts";
import {Page} from "../Page.ts";
import {StaticCSS} from "./Types/StaticCSS.ts";

export var contentTypeJS: RouteValidator = (req: ServerRequest) => req.url.endsWith(".js");
export var contentTypeCSS: RouteValidator = (req: ServerRequest) => req.url.endsWith(".css");


export var contentProviderJS: PageProvider = (env:RequestEnvironment) => {
	return new ContentPage();
};

export var contentProviderCSS: PageProvider = (env:RequestEnvironment) => {
	return StaticCSS.new(env);
};

export class ContentPage extends Page {
	public getResponse(): Object {
		throw new Error("Method not implemented.");
	}
}