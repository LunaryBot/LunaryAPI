require('dotenv').config();
const { default: axios } = require('axios');

const api = axios.create({
	baseURL: `http://localhost:${process.env.PORT}`,
});

describe('auth tests', () => {
	it('test valid token', async () => {
		const res = await api.get('/auth?token=' + process.env.TEST_TOKEN).catch(err => err.response);

		console.log(res.data);
		expect(res.status).toBe(200);
	});

	it('test invalid token', async () => {
		const res = await api.get('/auth?token=haha-invalid-token').catch(err => err.response);

		console.log(res.data);
		expect(res.status).toBe(401);
	});
});