import {Page} from "../../Page.ts";
import {RequestEnvironment} from "../../../Util/RequestEnvironment.ts";
import {IO} from "../../../Util/IO.ts";
import {Dendro} from "../../../Dendro.ts";


export var MimeTypes: Map<string, string> = new Map<string, string>([
	[".png", "image/png"],
	[".jpeg", "image/jpeg"],
	[".jpg", "image/jpeg"],
	[".jfif", "image/jpeg"],
	[".pjpeg", "image/jpeg"],
	[".pjp", "image/jpeg"],
	[".gif", "image/gif"],
	[".svg", "image/svg+xml"],
	[".js","application/javascript"],
	[".css","text/css"],
])


export class ServeAny extends Page {

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
		return new ServeAny(env)
	}

	public getResponse(): Object {
		let f = IO.getAssetPath(this.env.parent.getAssetPath(), this.filename);
		var fileType = `.${this.filename.split(".").reverse()[0]}`
		console.log(fileType);
		if(MimeTypes.has(fileType)){
			this.headers.set("Content-Type",MimeTypes.get(fileType) as string )
		}
		console.log(this.headers);
		try {
			let content = Deno.readFileSync(f);
			return {
				body: content,
				headers:this.headers
			}
		} catch (error){
			Dendro.logger.Warning(`404 on static file: ${f}`)
			return Dendro.Page400(404);
		}

	}
}
