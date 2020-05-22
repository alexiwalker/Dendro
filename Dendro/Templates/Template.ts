export class Template {
	private _baseFile: string;

	public content: string = "";

	conditionalPattern: RegExp = new RegExp("({{@ifs*?[([A-z]*?)]s*?(([^){]*?))s*?elses*?(([^)]*?))}})");
	includePattern: RegExp = new RegExp('({{@includes"[A-Za-z0-9.\\/]+"}})');
	includeOncePatter: RegExp = new RegExp('({{@includeonces"[A-Za-z0-9.\\/]+"}})');
	replacersPattern: RegExp = new RegExp("([[[A-Za-z0-9]+]])");
	filenamesPattern: RegExp = new RegExp('("[A-Za-z0-9.\\/]+")');
	inlineJSPattern: RegExp = new RegExp('({{@JSs"[A-Za-z0-9.\\/]+"}})');
	inlineCSSPattern: RegExp = new RegExp('({{@CSSs"[A-Za-z0-9.\\/]+"}})');
	includeJSPattern: RegExp = new RegExp('({{@linkJSs"[A-Za-z0-9.\\/]+"}})');
	includeCSSPattern: RegExp = new RegExp('({{@linkCSSs"[A-Za-z0-9.\\/]+"}})');

	private constructor(baseFile: string) {
		this._baseFile = baseFile;
	}

	/**
	 * Async constructor wrapper to allow async reading of template from the filesystem
	 */
	public static async CreateAsync(file: string): Promise<Template> {
		let t = new Template(file);
		const decoder = new TextDecoder("utf-8");
		t.content = decoder.decode(await Deno.readFile(t._baseFile));
		return t;
	}

	/**
	 * Syncronous equivalent of CreateAsync, with a blocking file IO operation. Not recommended
	 */
	public static CreateSync(file: string): Template {
		let t = new Template(file);
		const decoder = new TextDecoder("utf-8");
		t.content = decoder.decode(Deno.readFileSync(t._baseFile));
		return t;
	}

	//todo
}
