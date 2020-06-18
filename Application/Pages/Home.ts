import {Page} from "../../Dendro/Pages/Page.ts";
import {RequestEnvironment} from "../../Dendro/Util/RequestEnvironment.ts";
import {ServerRequest} from "../../Dendro/Dendro.ts";
import {IO} from "../../Dendro/Util/IO.ts";

export class HomePage extends Page {
	_request: ServerRequest;
	_environment: RequestEnvironment;

	private constructor(requestEnvironment: RequestEnvironment) {
		super();
		this._environment = requestEnvironment;
		this._request = requestEnvironment.request;
	}

	public getResponse(): Object {
		var f = IO.getAssetPath(this._environment.parent.getAssetPath(), "/index.html")
		let bodycontent  = Deno.readTextFileSync(f)

		return {body: bodycontent, status: 200};
	}

	static new(environment: RequestEnvironment): Page {
		return new HomePage(environment);
	}
}