import {Page} from "./Page.ts";
import {StatusError} from "../Util/mod.ts";
import {RequestEnvironment} from "../Util/RequestEnvironment.ts";

export class ErrorPage extends Page {
	static new(env: RequestEnvironment): Page {
		throw new StatusError(501);
	}

	public getResponse(): Object {
		throw new Error("Method not implemented.");
	}
}
