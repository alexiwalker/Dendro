import { RouteValidator, RouteMap } from "./Dendro/Routes/mod.ts";
import { ServerRequest, PageProvider } from "./Dendro/Dendro.ts";
import { HomePage, Page } from "./Dendro/Pages/mod.ts";

let contentTypeJS = (req: ServerRequest) => req.url.endsWith(".js");
let contentTypeCSS = (req: ServerRequest) => req.url.endsWith(".css");

export class ContentPage extends Page {
	public getResponse(): Object {
		throw new Error("Method not implemented.");
	}
}

var contentProviderJS: PageProvider = (req: ServerRequest) => {
	return new ContentPage();
};

var contentProviderCSS: PageProvider = (req: ServerRequest) => {
	return new ContentPage();
};
