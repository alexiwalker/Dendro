// @ts-ignore
import {ILogger} from "./ILogger.ts";
import {Env} from "../Env.ts";

export class ConsoleLogger implements ILogger {
	critical(data: any): void {
		console.log("Critical Log: " + data);
	}

	error(data: any): void {
		console.log("Error Logged: " + data);
	}

	info(data: any): void {
		console.log("Info: " + data);
	}

	log(data: any): void {
		if (typeof data === "string") {
			console.log(data);
		} else if (data instanceof Error) {
			console.log(data.stack);
		} else {
			try {
				console.log(data);
			} catch (e) {
				console.log("Could not log data of type : " + typeof data);
			}
		}
	}

	warning(data: any): void {
		console.log("Warning: " + data);
	}

	debug(data: any): void {
		if (Env.Numeric("DEBUG", 0) > 0)
			console.log("Debug: " + data);
	}
}
