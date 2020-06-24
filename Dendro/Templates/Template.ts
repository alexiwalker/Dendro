/**
 * Template is an engine to help with composing HTML responses, based on text files with certain patterns of text
 *
 * Currently relies on an imported version of Mustache.JS
 * Examples can be found here
 * https://mustache.github.io/mustache.5.html
 */

import MTemplate from "./mustacheSource.js";
import {Dendro} from "../Dendro.ts";

function render(body: string, model: Object | undefined): string {
	// @ts-ignore
	return MTemplate.render(body, model);
}

export class Template {
	private _baseFile: string;
	private _templatePath: string;
	private content: string = ""

	private constructor(baseFile: string, templatePath: string) {
		this._templatePath = templatePath;
		this._baseFile = this._templatePath + baseFile;
	}

	/**
	 * Async factory to allow async reading of template from the filesystem
	 */
	public static async CreateAsync(file: string): Promise<Template> {
		let t = new Template(file, Dendro.templatePath);

		t.content = await Deno.readTextFile(t._baseFile)
		return t;
	}

	/**
	 * Synchronous factory with a blocking file IO operation. Not recommended. May throw if file is not found or could not be read
	 */
	public static CreateSync(file: string): Template {
		let t = new Template(file, Dendro.templatePath);

		t.content = Deno.readTextFileSync(t._baseFile)
		return t;
	}

	public Render(model: Object): string {
		this.content = render(this.content, model) ?? this.content;
		return this.content;
	}

}
