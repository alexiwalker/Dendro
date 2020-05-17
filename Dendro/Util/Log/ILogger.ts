export interface ILogger {
	LogString(data: string): void;
	LogError(data: Error): void;
}
