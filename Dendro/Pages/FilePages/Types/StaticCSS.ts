import {Page} from "../../Page.ts";
import {RequestEnvironment} from "../../../Util/RequestEnvironment.ts";

const CSSMimeType = "text/css"

const AssetsPath = ""

export class StaticCSS extends Page {

	private filename: string;

	constructor(file: string) {
		super();

		this.filename = file;

	}

	public getResponse(): Object {

		var content:string = Deno.readTextFileSync(this.filename);

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