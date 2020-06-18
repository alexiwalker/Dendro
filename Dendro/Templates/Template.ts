
export class Template {
	public content: string = "";
	conditionalPattern: RegExp = new RegExp("({{@ifs*?[([A-z]*?)]s*?(([^){]*?))s*?elses*?([^)]*?)}}");
	includePattern: RegExp = new RegExp('({{@includes"[A-Za-z0-9.\\/]+"}})');
	includeOncePatter: RegExp = new RegExp('({{@includeonces"[A-Za-z0-9.\\/]+"}})');
	replacersPattern: RegExp = new RegExp("([[[A-Za-z0-9]+]])");
	filenamesPattern: RegExp = new RegExp('("[A-Za-z0-9.\\/]+")');
	inlineJSPattern: RegExp = new RegExp('({{@JSs"[A-Za-z0-9.\\/]+"}})');
	inlineCSSPattern: RegExp = new RegExp('({{@CSSs"[A-Za-z0-9.\\/]+"}})');
	includeJSPattern: RegExp = new RegExp('({{@linkJSs"[A-Za-z0-9.\\/]+"}})');
	includeCSSPattern: RegExp = new RegExp('({{@linkCSSs"[A-Za-z0-9.\\/]+"}})');
	private _baseFile: string;

	private constructor(baseFile: string) {
		this._baseFile = baseFile;
	}

	/**
	 * Async factory to allow async reading of template from the filesystem
	 */
	public static async CreateAsync(file: string): Promise<Template> {
		let t = new Template(file);

		t.content = await Deno.readTextFile(file)
		return t;
	}

	/**
	 * Synchronous factory with a blocking file IO operation. Not recommended. May throw if file is not found or could not be read
	 */
	public static CreateSync(file: string): Template {
		let t = new Template(file);

		t.content = Deno.readTextFileSync(file)
		return t;
	}

}
