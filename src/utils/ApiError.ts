class ApiError extends Error {
	public name: string;
	public status: number;
	public stacks?: string[];

	constructor(message: string, status: number = 500, stacks?: string[]) {
		super(message);

		this.name = this.constructor.name;

		Error.captureStackTrace(this, this.constructor);

		this.status = status;

		this.stacks = stacks;

		delete this.stack;
	}
}

export default ApiError;