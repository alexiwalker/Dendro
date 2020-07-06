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
	[".js", "application/javascript"],
	[".css", "text/css"],
])


export class ServeAny extends Page {

	private filename: string;
	private env: RequestEnvironment;
	private headers: Map<string, string>;
	private basePath:string;
	constructor(env: RequestEnvironment, basepath:string="", filepath:string = "") {
		super();
		this.env = env;

		if(filepath=="")
			this.filename = env.request.url;
		else {
				this.filename = filepath
		}

		this.headers = env.Headers;
		this.basePath = basepath
	}

	public static new(env: RequestEnvironment, path:string,filepath:string="") {
		return new ServeAny(env,path,filepath)
	}


	public getResponse(): Object {
		let f = `${this.basePath}/${this.filename}`
		let fileType = `.${this.filename.split(".").reverse()[0]}`
		if (MimeTypes.has(fileType)) {
			this.headers.set("Content-Type", MimeTypes.get(fileType) as string)
		}
		try {
			let content = Deno.readFileSync(f);
			return {
				body: content,
				headers: this.headers
			}
		} catch (error) {
			Dendro.logger.Warning(`404 on static file: ${f}`)
			return Dendro.Page400(404);
		}

	}
}
