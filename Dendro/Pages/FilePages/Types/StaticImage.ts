import {Page} from "../../Page.ts";
import {RequestEnvironment} from "../../../Util/RequestEnvironment.ts";
import {IO} from "../../../Util/IO.ts";

const SVGMimeType = "image/svg+xml"

export var ImageTypes: Map<string, string> = new Map<string, string>([
	[".png", "image/png"],
	[".jpeg", "image/jpeg"],
	[".jpg", "image/jpeg"],
	[".jfif", "image/jpeg"],
	[".pjpeg", "image/jpeg"],
	[".pjp", "image/jpeg"],
	[".gif", "image/gif"],
	[".svg", "image/svg+xml"],
])


export class StaticImage extends Page {

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
		return new StaticImage(env)
	}

	public getResponse(): Object {
		let beforeandafter = this.filename.split(".")
		let imagetype = beforeandafter.reverse()[0];

		let f = IO.getAssetPath(this.env.parent.getAssetPath(), this.filename);
		let content = Deno.readFileSync(f);
		this.headers.set("Content-Type", ImageTypes.get("." + imagetype) as string)
		return {
			headers: this.headers,
			body: content
		}
	}
}