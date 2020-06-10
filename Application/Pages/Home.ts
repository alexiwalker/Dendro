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
		let bodycontent =
			`<head><link href="style.css"  rel="stylesheet" type="text/css"/><script src="hello.js"></script><title>Page</title></head><body class="body">
			


			</body>`;

		return {body: bodycontent, status: 200};
	}

	static new(environment: RequestEnvironment): Page {
		return new HomePage(environment);
	}
}