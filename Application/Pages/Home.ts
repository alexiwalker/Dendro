import {Page} from "../../Dendro/Pages/Page.ts";
import {RequestEnvironment} from "../../Dendro/Util/RequestEnvironment.ts";
import {ServerRequest} from "../../Dendro/Dendro.ts";

export class HomePage extends Page {
	_request: ServerRequest;
	_environment: RequestEnvironment;

	private constructor(requestEnvironment: RequestEnvironment) {
		super();
		this._environment = requestEnvironment;
		this._request = requestEnvironment.request;
	}

	public getResponse(): Object {
		let bodycontent  = Deno.readTextFileSync("C:\\Users\\alex\\Projects\\WebStormProjects\\Atrius\\Application\\Assets\\index.html")


		return {body: bodycontent, status: 200};
	}

	static new(environment: RequestEnvironment): Page {
		return new HomePage(environment);
	}
}