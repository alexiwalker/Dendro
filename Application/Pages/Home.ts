import {Page} from "../../Dendro/Pages/Page.ts";
import {RequestEnvironment} from "../../Dendro/Util/RequestEnvironment.ts";
import {Dendro, ServerRequest} from "../../Dendro/Dendro.ts";
import {IO} from "../../Dendro/Util/IO.ts";
import {Template} from "../../Dendro/Templates/Template.ts";

export class HomePage extends Page {
	_request: ServerRequest;
	_environment: RequestEnvironment;

	private constructor(requestEnvironment: RequestEnvironment) {
		super();
		this._environment = requestEnvironment;
		this._request = requestEnvironment.request;
	}

	public getResponse(): Object {
	let bodycontent = Template.createSync("/index.html").render();

		return {body: bodycontent, status: 200};
	}

	static new(environment: RequestEnvironment): Page {
		return new HomePage(environment);
	}
}

export class TemplatedHomePage extends Page {
	_request: ServerRequest;
	_environment: RequestEnvironment;

	private constructor(requestEnvironment: RequestEnvironment) {
		super();
		this._environment = requestEnvironment;
		this._request = requestEnvironment.request;
	}

	public getResponse(): Object {
		let bodycontent = Template.createSync("/tplHome.tpl").render({variableA:"ABCDEFG"})
		return {body: bodycontent, status: 200};
	}

	static new(environment: RequestEnvironment): Page {
		return new TemplatedHomePage(environment);
	}
}