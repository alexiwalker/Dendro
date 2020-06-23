export class IO {
	public static getAssetPath(assetsPath: string, requestedAsset: string): string {

		return assetsPath + (requestedAsset.replace("/", "\\"));
	}

	public static getTemplatePath(assetsPath: string, requestedAsset: string): string {

		return assetsPath + (requestedAsset.replace("/", "\\"));
	}
}