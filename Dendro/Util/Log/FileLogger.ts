// import { writeFileStrSync } from "https://deno.land/std@0.51.0/fs/mod.ts";
import { ILogger } from "./ILogger.ts";

//todo: implement this when deno IO stops erroring on me?
export class FileLogger implements ILogger {
	outputFileName!: string;

	Critical(data: string): void {
		//File.write("Critical.log", data);
	}

	Error(data: string): void {
		//File.write("Error.log", data);
	}

	Info(data: string): void {
		//File.write("Critical.log", data);
	}

	Log(data: string): void;
	Log(data: Error): void;
	Log(data: string | Error): void {
		if (typeof data === "string") {
			//File.write("Critical.log", data);
		} else if (data instanceof Error) {
			//File.write("Critical.log", data);
		}
	}

	Warning(data: string): void {}
}
