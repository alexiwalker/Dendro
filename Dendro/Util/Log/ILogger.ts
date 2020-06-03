export declare type Logger = ILogger;

export interface ILogger {
	Log(data: string): void;
	Log(data: Error): void;

	Info(data: string): void;
	Warning(data: string): void;
	Error(data: string): void;
	Critical(data: string): void;
}
