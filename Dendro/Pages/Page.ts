/**
 * A Page object is flexible, but must provide an object that fits the response format
 * let response:Object = {
 *     body:"<html>This is some html</html>",
 *     headers:Map<string,string>,
 *     status:200
 * }
 * The headers entry is a map of Key:Value pairs of headers.
 * The Deno Header interface is conforms to the default interface of the JS/TS Map type
 *
 * status is the HTTP status code. Eg, 200 or 404
 */
export abstract class Page {
	public abstract getResponse(): Object;
}
