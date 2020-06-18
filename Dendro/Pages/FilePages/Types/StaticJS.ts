import {Page} from "../../Page.ts";
import {RequestEnvironment} from "../../../Util/RequestEnvironment.ts";
import {IO} from "../../../Util/IO.ts";

const JSMimeType = "application/javascript"

export class StaticJS extends Page {

	private readonly filename: string;
	private readonly env: RequestEnvironment;
	private readonly headers: Map<string, string>;

	constructor(env: RequestEnvironment) {
		super();
		this.env = env;
		this.filename = env.request.url;
		this.headers = env.Headers;
	}

	public static new(env: RequestEnvironment) {
		return new StaticJS(env)
	}

	public getResponse(): Object {
		let f = IO.getAssetPath(this.env.parent.getAssetPath(), this.filename);
		let content: string = Deno.readTextFileSync(f);

		this.headers.set("Content-Type", JSMimeType)
		return {
			headers: this.headers,
			body: content
		}
	}
}