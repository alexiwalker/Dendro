import { ILogger } from "./ILogger.ts";

export class ConsoleLogger implements ILogger {
	implements: String[] = ["ILogger", "ConsoleLogger"];

	LogError(data: Error): void {
		if (data.stack?.toString != null) {
			this.LogString(data.stack.toString());
		}
	}

	ConsoleLogger() {}

	LogString(data: string): void {
		console.log(data);
	}
}
