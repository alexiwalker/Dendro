// import { writeFileStrSync } from "https://deno.land/std@0.51.0/fs/mod.ts";
import { ILogger } from "./ILogger.ts";

export class FileLogger implements ILogger {
	outputFileName!: string;

	FileLogger(file: string) {
		// this.outputFileName = file;
	}

	LogString(data: string): void {
		// writeFileStrSync(this.outputFileName, data);
	}

	LogError(data: Error): void {
		// if (data.stack?.toString != null) {
		// 	this.LogString(data.stack.toString());
		// }
	}
}
