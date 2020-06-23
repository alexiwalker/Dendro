/**
 * Template is an engine to help with composing HTML responses, based on text files with certain patterns of text
 *
 * For example, {{@include "navigation.tpl"}} would replace that section with the contents of the navigation.tpl file
 * But, if a file only needs to be included once and only once, @includeonce is used instead
 *
 *  {{@IJS "file.js"}} can be used to include the inline script contents of file.js. This file must be included in
 *  Template route folder
 *
 *  {{@JS "file.js"}} will include a link to an separate page of file.js. This file will be served like any normal file
 *
 *  {{@ICSS "file.css"}} and {{@CSS "file.css"}} function the same as @IJS and @JS, but with CSS file
 *
 *  Keyed replacers are denoted by [[KEY]] where KEY is a key value in a Map<String,String> and is replaced by the value.
 *  Unused keys are ignored. Replacers with no associated key are ignored. If multiple of a single replacer is used,
 *  All of them will be replaced.
 *  if a replacer gets replaced and contains another replacer, that one will be replaced until no more remain
 *  if it contains its own replacer, it will likely cause a stack overflow or recursion limit error
 */

import MTemplate from "./mustacheSource.js";
import {Dendro} from "../Dendro.ts";

function render(body: string, model: Object | undefined):string {
	// @ts-ignore
	return MTemplate.render(body, model);
}

export class Template {
	private _baseFile: string;
	private _templatePath: string;
	private content:string = ""
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

	public Render(model :Object):string{
		this.content = render(this.content,model)??this.content;
		return this.content;
	}

}
