import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";
import { HomePage } from "./HomePage.ts";

export abstract class Page {
	/**
	 * name
	 */

	public abstract getResponse(): Object;
}
