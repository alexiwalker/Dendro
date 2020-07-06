// import { writeFileStrSync } from "https://deno.land/std@0.51.0/fs/mod.ts";
import {ILogger} from "./ILogger.ts";

export class FileLogger implements ILogger {
	outputFileName!: string;

	Critical(data: any): void {
		//File.write("Critical.log", data);
	}

	Error(data: any): void {
		//File.write("Error.log", data);
	}

	Info(data: any): void {
		//File.write("Critical.log", data);
	}

	Log(data: any): void {
	}

	Warning(data: any): void {
	}

	Debug(data: any): void {
	}
}
