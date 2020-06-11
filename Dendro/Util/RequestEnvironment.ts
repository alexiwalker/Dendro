import { ServerRequest } from "../Dendro.ts";

export class RequestEnvironment {
	public request: ServerRequest;

	public environmentVars: Map<string, object>;

	constructor(request: ServerRequest) {
		this.request = request;
		this.environmentVars = new Map<string, object>();
	}

	public RemoteIP = (): String => (this.request.conn.remoteAddr as Deno.NetAddr).hostname;

	public LocalIP = (): String => (this.request.conn.localAddr as Deno.NetAddr).hostname;
}
