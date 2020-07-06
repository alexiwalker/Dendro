// @ts-ignore
import {ILogger} from "./ILogger.ts";
import {Env} from "../Env.ts";

export class ConsoleLogger implements ILogger {
	Critical(data: any): void {
		console.log("Critical Log: " + data);
	}

	Error(data: any): void {
		console.log("Error Logged: " + data);
	}

	Info(data: any): void {
		console.log("Info: " + data);
	}

	Log(data: any): void {
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

	Warning(data: any): void {
		console.log("Warning: " + data);
	}

	Debug(data: any): void {
		if (Env.Numeric("DEBUG", 0) > 0)
			console.log("Debug: " + data);
	}
}
