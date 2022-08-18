import { Router } from 'express';


class BaseRouter {
	public readonly apollo: Apollo;
	public readonly router = Router();

	public path: string;

	constructor({ path = '/', apollo }: { path: string, apollo: Apollo }) {
		this.path = path;

		Object.defineProperty(this, 'apollo', { value: apollo, enumerable: false, writable: false });

		this.apollo.use(path, this.router);
	}

	get use() {
		return this.router.use.bind(this.router);
	}

	get get() {
		return this.router.get.bind(this.router);
	}

	get post() {
		return this.router.post.bind(this.router);
	}

	get put() {
		return this.router.put.bind(this.router);
	}

	get delete() {
		return this.router.delete.bind(this.router);
	}

	get patch() {
		return this.router.patch.bind(this.router);
	}
}