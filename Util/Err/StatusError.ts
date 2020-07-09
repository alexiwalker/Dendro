export class StatusError extends Error {
	statusCode!: number;

	constructor(statusCode: number) {
		super(statusCode.toString());
		this.statusCode = statusCode;
	}
}
