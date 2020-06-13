import {Page} from "../../Page.ts";
import {RequestEnvironment} from "../../../Util/RequestEnvironment.ts";

const JSMimeType = "application/javascript"

export class StaticJS extends Page {

	private filename: string;

	constructor(file: string) {
		super();

		this.filename = file;

	}

	public getResponse(): Object {
		//todo: Add a way to set the Asset Route ({projectRoute}/Application/Assets/ etc so that it can read from the right place)
		var content:string = Deno.readTextFileSync(this.filename);
		return {
			//disabled right now, adding headers like this caused errors because it didn't have headers.length
			// todo: see how deno likes headers to be handled so i can set the proper mime type w/o breaking stuff
			// headers: {
			// 	"Content-Type":JSMimeType
			// },
			body:content
		}
	}

	public static  new(env:RequestEnvironment) {
		return new StaticJS(env.request.url)
	}
}