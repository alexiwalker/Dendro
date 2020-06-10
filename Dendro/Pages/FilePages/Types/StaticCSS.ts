import {Page} from "../../Page.ts";
import {PageProvider} from "../../../Dendro.ts";
import {RequestEnvironment} from "../../../Util/RequestEnvironment.ts";

const CSSMimeType = "text/css"

export class StaticCSS extends Page {

	private filename: String;

	constructor(file: String) {
		super();

		this.filename = file;

	}

	public getResponse(): Object {

		var content:string = ""
		// Deno.readAllSync(Reader)
		return {
			// headers: {
			// 	"Content-Type":CSSMimeType
			// },
			body:content
		}
	}

	public static  new(env:RequestEnvironment) {
		return new StaticCSS(env.request.url)
	}
}