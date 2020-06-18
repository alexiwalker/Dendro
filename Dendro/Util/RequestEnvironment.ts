import {Dendro, ServerRequest} from "../Dendro.ts";

export class RequestEnvironment {
	public request: ServerRequest;

	public environmentVars: Map<string, object>;
	public Headers: Map<string, string>;
	public parent: Dendro;

	constructor(request: ServerRequest, parent: Dendro) {
		this.request = request;
		this.environmentVars = new Map<string, object>();
		this.Headers = new Map<string, string>();
		this.parent = parent;
	}

	//this.request passthroughs
	public get url() {
		return this.request.url
	}

	public get method() {
		return this.request.method
	}

	public get headers() {
		return this.request.headers
	}

	public get body() {
		return this.request.body
	}


	public get RemoteIP(): String {
		return (this.request.conn.remoteAddr as Deno.NetAddr).hostname
	}

	public get LocalIP(): String {
		return (this.request.conn.localAddr as Deno.NetAddr).hostname
	}

}
