// import { writeFileStrSync } from "https://deno.land/std@0.51.0/fs/mod.ts";
import {ILogger} from "./ILogger.ts";

export class FileLogger implements ILogger {
	outputFileName!: string;

	critical(data: any): void {
		//File.write("Critical.log", data);
	}

	error(data: any): void {
		//File.write("Error.log", data);
	}

	info(data: any): void {
		//File.write("Critical.log", data);
	}

	log(data: any): void {
	}

	warning(data: any): void {
	}

	debug(data: any): void {
	}
}
