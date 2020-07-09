import {Page} from "./Page.ts";
import {StatusError} from "../Util/mod.ts";
import {RequestEnvironment} from "../Util/RequestEnvironment.ts";

/**
 * This class throws an error if you try to use its static "new" function or call GetResponse
 * Primarily used for testing when a certain page was required to throw an Error
 */
export class ErrorPage extends Page {
	static new(env: RequestEnvironment): Page {
		throw new StatusError(501);
	}

	public getResponse(): Object {
		throw new Error("Method not implemented.");
	}
}
