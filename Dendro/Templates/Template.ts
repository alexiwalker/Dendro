export class Template {
	private _baseFile: string;

	public content: string = "";

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
