import {Dendro, ServerRequest} from "../Dendro.ts";

export class RequestEnvironment {
	public request: ServerRequest;

	public environmentVars: Map<string, object>;

	constructor(request: ServerRequest, parent:Dendro) {
		this.request = request;
		this.environmentVars = new Map<string, object>();
		this.parent = parent;
	}

	public parent:Dendro;

	public RemoteIP = (): String => (this.request.conn.remoteAddr as Deno.NetAddr).hostname;

	public LocalIP = (): String => (this.request.conn.localAddr as Deno.NetAddr).hostname;
}
