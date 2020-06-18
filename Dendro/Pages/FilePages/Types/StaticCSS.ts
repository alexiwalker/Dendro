import {Page} from "../../Page.ts";
import {RequestEnvironment} from "../../../Util/RequestEnvironment.ts";
import {IO} from "../../../Util/IO.ts";

const CSSMimeType = "text/css"

const AssetsPath = ""

export class StaticCSS extends Page {

	private filename: string;
	private env: RequestEnvironment;
	private headers: Map<string, string>;

	constructor(env: RequestEnvironment) {
		super();
		this.env = env;
		this.filename = env.request.url;
		this.headers = env.Headers;
	}

	public static new(env: RequestEnvironment) {
		return new StaticCSS(env)
	}

	public getResponse(): Object {

		// var content:string = Deno.readTextFileSync("C:\\Users\\alex\\Projects\\WebStormProjects\\Atrius\\Application\\Assets\\styles.css");
		var f = IO.getAssetPath(this.env.parent.getAssetPath(), this.filename)
		let content: string = Deno.readTextFileSync(f);

		this.headers.set("Content-Type", CSSMimeType)
		return {
			headers: this.headers,
			body: content
		}
	}
}