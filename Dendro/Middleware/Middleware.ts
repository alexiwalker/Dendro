import {MiddleWare, ServerRequest} from "../Dendro.ts";
import {RequestEnvironment} from "../Util/RequestEnvironment.ts";
import {Post} from "../Routes/BasicRouter.ts";

export var DecodeBodyJSON: MiddleWare = async function (env: RequestEnvironment) {

	//right now, only allow it to attempt to decode a post request
	if (env.request.method == Post)
		return;

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
		//No Json in body to decode. Which is fine. Sometimes. It shouldn't let an error bubble up; a page requiring post data should do that instead
	}
};
