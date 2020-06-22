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
import {Dendro} from "../Dendro.ts";

export class Template {

	public static templatesRoot: string = "";
	public content: string = "";
	// nestedConditionalPattern: RegExp = /{{@if\s*?\[([A-z]+)]\s*?\(([^(]*?)\)\s*?else\s*?\(([\s\S]*?)\)\s*?@eif}}/;
	// conditionalPattern: RegExp = new RegExp("({{@if\\s*?[([A-z]*?)]\\s*?(([^){]*?))\\s*?else\\s*?([^)]*?)}}");
	includePattern: RegExp = /{{@include\s"([A-Za-z0-9.\\\/]+)"}}/;
	includeOncePattern: RegExp = /{{@includeonce\s"([A-Za-z0-9.\\\/]+)"}}/;
	// replacersPattern: RegExp =    /\[\[([A-Za-z0-9]+)]]/g;
	replacersPattern: RegExp = /\[\[([a-zA-Z]*?)]]/g;
	filenamesPattern: RegExp = /("[A-Za-z0-9.\\/]+")/g;
	inlineJSPattern: RegExp = /({{@JS\\s"[A-Za-z0-9.\\/]+"}})/g;
	inlineCSSPattern: RegExp = /({{@CSS\\s"[A-Za-z0-9.\\/]+"}})/g;
	includeJSPattern: RegExp = /({{@linkJS\\s"[A-Za-z0-9.\\/]+"}})/g;
	includeCSSPattern: RegExp = /({{@linkCSS\\s"[A-Za-z0-9.\\/]+"}})/g;
	private _baseFile: string;
	private _templatePath: string;
	public usedFiles: Array<String>;
	public Replacers: Map<string, string | boolean>

	private constructor(baseFile: string, templatePath: string) {
		this._templatePath = templatePath;
		this._baseFile = this._templatePath + baseFile;
		this.usedFiles = new Array<String>();
		this.Replacers = new Map<string, string>();
	}

	/**
	 * Async factory to allow async reading of template from the filesystem
	 */
	public static async CreateAsync(file: string, templatePath: string): Promise<Template> {
		let t = new Template(file, templatePath);

		t.content = await Deno.readTextFile(t._baseFile)
		return t;
	}

	/**
	 * Synchronous factory with a blocking file IO operation. Not recommended. May throw if file is not found or could not be read
	 */
	public static CreateSync(file: string, templatePath: string): Template {
		let t = new Template(file, templatePath);

		t.content = Deno.readTextFileSync(t._baseFile)
		return t;
	}

	/**
	 * Run all conditionals, then includes, and then replacers, updating this.content at each step
	 */
	public Render(): Template {
		// return this.runConditional().runIncludes().runReplacers();
		return this.runIncludes().runReplacers();
	}


	/**
	 * Replaces all instances of {{@include "file.tpl"}} with the contents of file.tpl
	 * If file.tpl was already specified by an includeonce, it will still be included here
	 */
	public runInclude(): Template {

		while (this.includePattern.test(this.content)) {
			try {
				let matches = this.content.match(this.includePattern);
				if (matches) {
					let f = matches[1];
					f = this._templatePath + "/" + f
					let t = Deno.readTextFileSync(f);
					this.content = this.content.replace(matches[0], t)
				}
			} catch (e) {
				e = e as Error
				Dendro.logger.Debug(e.message)
			}
		}
		return this;
	}

	/**
	 * Replaces the first instance of {{@includeonce "file.tpl"}} with the contents of file.tpl
	 * All subsequent {{@includeonce "file.tpl"}} are removed
	 * If file.tpl was already included by {{@include "file.tpl"}} but not by includeonce, it will still be included once here
	 */
	public runIncludeOnce(): Template {


		while (this.includeOncePattern.test(this.content)) {
			try {
				let matches = this.content.match(this.includeOncePattern);
				if (matches) {
					let f = matches[1];

					if (this.usedFiles.includes(f)) {
						this.content = this.content.replace(matches[0], "")
						continue;
					} else {
						this.usedFiles.push(f);

					}

					f = this._templatePath + "/" + f

					let t = Deno.readTextFileSync(f);
					this.content = this.content.replace(matches[0], t)
				}
			} catch (e) {
				e = e as Error
				Dendro.logger.Debug(e.message)
			}
		}
		return this;
	}

	/**
	 * Replace all {{@include}} and {{@includeonce}} directives in the template
	 */
	public runIncludes(): Template {
		this.runInclude().runIncludeOnce();

		return this;
	}


	/**
	 * Runs any conditional statements.
	 * Conditionals fit the form of:
	 * {{@if [VARNAME] (conditional) else (otherwise)}}
	 * where [VARNAME] (single square brackets) is the key that will be tested
	 * values in (conditional) and (otherwise) are replaced verbatim and will then (if applicable) be evaluated again
	 *
	 * Conditional keys can be added by addReplacer, with the value being a boolean.
	 * Eg: addReplacer("KEY", True)
	 * If they key for a conditional is not found, or is (boolean) false, else (if it exists) will be execute.
	 * Otherwise, the section will be hidden
	 *
	 */
	// public runConditional(): Template {
	// 	while (this.nestedConditionalPattern.test(this.content)) {
	// 		let matches = this.content.match(this.nestedConditionalPattern);
	// 		if (matches) {
	// 			let original = matches[0];
	// 			let key = matches[1]
	// 			let conditional = matches[2]
	// 			let otherwise = matches[3]
	//
	//
	// 			if(this.Replacers.has(key)){
	// 				let n = this.Replacers.get(key);
	// 				if(n as boolean && n){
	// 					this.content = this.content.replace(original,conditional)
	// 				} else {
	// 					this.content = this.content.replace(original,otherwise)
	// 				}
	// 			} else {
	// 				this.content = this.content.replace(original,otherwise)
	// 			}
	// 		}
	// 	}
	// 	return this;
	// }

	/**
	 * Replace all instances of [[KEY]] with the value set by addReplacer("KEY",value)
	 * If key does not exist, the replacer is removed.
	 * This process is repeated until no [[KEY]] elements remain
	 */
	public runReplacers(): Template {

		while (this.replacersPattern.test(this.content)) {
			let matches = this.content.match(this.replacersPattern);

			if (matches) {

				let val: string = matches[0].replace("[[", "").replace("]]", "");
				if (this.Replacers.has(val)) {
					val = this.Replacers.get(matches[0].replace("[[", "").replace("]]", "")) as string
				} else {
					val = "";
				}

				this.content = this.content.replace(matches[0], val)

			}

		}

		return this;
	}

	/**
	 * Add a key and value to be used in the evaluation of Conditionals and Replacers.
	 * A conditional requires a boolean, and replacers use strings.
	 * If a conditional key exists but uses a string, or a false boolean, the 'else' will be evaluated if it exists.
	 * Otherwise, the section will be removed
	 * @param key: string key that is used to identify conditionals and replacers
	 * @param value: string | boolean that will be used in the evaluation of the condition or replacer
	 */
	public addReplacer(key: string, value: string | boolean) {
		this.Replacers.set(key, value);
	}
}
