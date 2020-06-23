import {Page} from "../../Page.ts";
import {RequestEnvironment} from "../../../Util/RequestEnvironment.ts";
import {IO} from "../../../Util/IO.ts";

export class StaticAny extends Page {

	private filename: string;
	private env: RequestEnvironment;

	constructor(env: RequestEnvironment) {
		super();
		this.env = env;
		this.filename = env.request.url;
	}

	public static new(env: RequestEnvironment) {
		return new StaticAny(env)
	}

	public getResponse(): Object {
		let f = IO.getAssetPath(this.env.parent.getAssetPath(), this.filename);
		let content = Deno.readFileSync(f);

		return {
			body: content
		}
	}
}