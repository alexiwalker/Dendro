import { ServerRequest } from "../Dendro.ts";

export class RequestEnvironment {
	public request: ServerRequest;

	public environmentVars: Map<string, object>;

	constructor(request: ServerRequest) {
		this.request = request;
		this.environmentVars = new Map<string, object>();
	}

}
