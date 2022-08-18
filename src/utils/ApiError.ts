class ApiError extends Error {
	public name: string;
	public status: number;

	constructor(message: string, status: number = 500) {
		super(message);

		this.name = this.constructor.name;

		Error.captureStackTrace(this, this.constructor);

		this.status = status;

		delete this.stack;
	}
}

export default ApiError;