// @ts-ignore
import { ILogger } from "./ILogger.ts";

export class ConsoleLogger implements ILogger {
	Critical(data: string): void {
		// console.log(data, "\033[93m");
	}

	Error(data: string): void {
		// console.log(data, "\033[93m");
	}

	Info(data: string): void {
		// console.log(data, "color: blue");
	}

	Log(data: string): void;
	Log(data: Error): void;
	Log(data: string | Error): void {
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

	Warning(data: string): void {}
}
