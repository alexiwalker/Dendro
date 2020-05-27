export declare type Logger = ILogger;

export interface ILogger {
	LogString(data: string): void;
	LogError(data: Error): void;
	implements: Array<String>;
}
