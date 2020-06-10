import {Page} from "../../Page.ts";
import {PageProvider} from "../../../Dendro.ts";
import {RequestEnvironment} from "../../../Util/RequestEnvironment.ts";

const CSSMimeType = "application/javascript"

export class StaticJS extends Page {

	private filename: String;

	constructor(file: String) {
		super();

		this.filename = file;

	}

	public getResponse(): Object {

		var content:string = ""
		return {
			// headers: {
			// 	"Content-Type":CSSMimeType
			// },
			body:content
		}
	}

	public static  new(env:RequestEnvironment) {
		return new StaticJS(env.request.url)
	}
}