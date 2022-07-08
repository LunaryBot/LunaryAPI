import { Client } from 'eris';
import WebSocket, { RawData } from 'ws';
import Databases from '../structures/Databases';

export class vCodesWrapper {
	private client: Client;
	private dbs: Databases;
	private ws: WebSocket|null = null;
    
	constructor (client: Client, dbs: Databases) {
		this.client = client;
		this.dbs = dbs;
	}

	connect() {
		if (this.ws !== null) {
			this.ws.removeAllListeners();
			try { this.ws.terminate(); } catch (e) {}
			this.ws = null;
		}

		return new Promise((resolve, reject) => {
			this.ws = new WebSocket(`wss://api.vcodes.xyz/v1/gateway?token=${process.env.VCODES_TOKEN}`);

			this.ws
				.once('open', () => resolve(true))
				.once('close', (code: number, reason?: string) => {
					this.ws?.removeAllListeners();
					this.ws = null;
					setTimeout(this.connect.bind(this), 30000);
					return reject(reason);
				})
				.on('message', async(data: RawData) => {
					if (Array.isArray(data)) data = Buffer.concat(data);
					else if (Buffer.isBuffer(data) || data instanceof ArrayBuffer) data = Buffer.from(data);

					const json = JSON.parse(data.toString());

					switch (json.type) {
					case 'ERROR':
						console.log(json.message);
						break;
					case 'CONNECT':
						console.log('Connected to vCodes gateway.');
						break;
					case 'VOTE':
						const user = this.client.users.add(json.data.user);
						await this.dbs.addVote(user.id, 'vcodes');
						this.client.createMessage(process.env.VOTES_CHANNEL, `❤ **| Muito obrigada pelo seu voto** \`${user.username}#${user.discriminator}\`**!**`);
						break;
					}
				})
				.on('error', (err: Error) => console.log(err));
		});
	}
}