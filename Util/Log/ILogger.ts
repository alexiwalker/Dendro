export declare type Logger = ILogger;

export interface ILogger {
	log(data: any): void;

	info(data: any): void;

	warning(data: any): void;

	error(data: any): void;

	critical(data: any): void;

	debug(data: any): void;
}
