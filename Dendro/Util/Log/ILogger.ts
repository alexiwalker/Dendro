export declare type Logger = ILogger;

export interface ILogger {
	Log(data: any): void;

	Info(data: any): void;

	Warning(data: any): void;

	Error(data: any): void;

	Critical(data: any): void;

	Debug(data: any): void;
}
