import { ApolloError } from 'apollo-server-core';

class ApiError extends ApolloError {
	public status: number;
	public stacks?: string[];

	constructor(message: string, status: number = 500, stacks?: string[]) {
		super(message);

		Object.defineProperty(this, 'name', { value: this.constructor.name });

		Error.captureStackTrace(this, this.constructor);

		this.status = status;

		this.stacks = stacks;

		this.message = message;

		delete this.stack;
	}
}

export default ApiError;