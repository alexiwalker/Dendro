import { MiddleWare, ServerRequest } from "../Dendro.ts";
import { RequestEnvironment } from "../Util/RequestEnvironment.ts";
import { MiddlewareError } from "../Util/Err/MiddlewareError.ts";

export var DecodeBodyJSON: MiddleWare = async function (env: RequestEnvironment) {
	try {
		let req: ServerRequest = env.request;
		let len = req.contentLength as number;
		const buf = new Uint8Array(len);
		let bufSlice = buf;
		let totRead = 0;
		while (true) {
			const nread = await req.body.read(bufSlice);
			if (nread === null) break;
			totRead += nread;
			if (totRead >= len) break;
			bufSlice = bufSlice.subarray(nread);
		}

		let bodyString = new TextDecoder("utf-8").decode(bufSlice);

		let obj = JSON.parse(bodyString);

		for (var key in obj) {
			console.log(key + " " + obj[key]);
		}

		env.environmentVars.set("body", obj);
	} catch (e) {
		if (e instanceof Error) {
			throw new MiddlewareError(e.message);
		} else {
			// throw e;
		}
	}
};
