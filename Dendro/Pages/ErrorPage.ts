import { Page } from "./Page.ts";
import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";
import { StatusError } from "../Util/mod.ts";

export class ErrorPage extends Page {
	public getResponse(): Object {
		throw new Error("Method not implemented.");
	}

	static new(request: ServerRequest): Page {
		throw new StatusError(501);
	}
}
