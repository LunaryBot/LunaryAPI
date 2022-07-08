import { IVoteData, IPunishmentLog } from '../@types/index';
import firebase from 'firebase';

const keys = ['apiKey', 'appId', 'authDomain', 'databaseURL', 'measurementId', 'messagingSenderId', 'projectId', 'storageBucket'];

class Databases {
	guilds: firebase.database.Database;
	users: firebase.database.Database;
	logs: firebase.database.Database;
	api: firebase.database.Database;

	constructor() {
		this.guilds = this.initializeDatabase('GuildsDB');
		this.users = this.initializeDatabase('UsersDB');
		this.logs = this.initializeDatabase('LogsDB');
		this.api = this.initializeDatabase('ApiDB');
	}

	initializeDatabase(name: string): firebase.database.Database {
		let app = firebase.apps.find((app: firebase.app.App) => app.name == name);

		if(!app) {
			app = firebase.initializeApp(Databases.getData(name), name);
		}
        
		return app.database();
	}

	async addVote(user: string, platform: string) {
		const db = (await this.users.ref(`Users/${user}`).once('value')).val();
		let votes: Array<IVoteData> = [];
		if (db && db.votes) votes = db.votes;
		votes.push({
			platform,
			date: Date.now()
		});
		await this.users.ref(`Users/${user}`)[db ? 'update' : 'set']({ votes });
	}

	async getUser(userId: string) {
		const db = await this.users.ref(`Users/${userId}`).once('value');
		return db.val() || {};
	}
    
	async getGuild(guildId: string) {
		const db = await this.guilds.ref(`Servers/${guildId}`).once('value');
		return db.val() || {};
	}

	async setGuild(guildId: string, data: any) {
		await this.guilds.ref(`Servers/${guildId}`).set(data);
	}

	async getPunishmentLogs(): Promise<{ [id: string ]: IPunishmentLog }> {
		const data: { [id: string ]: IPunishmentLog } = (await this.logs.ref().once('value')).val() || {};

		delete data.cases;

		return data;
	}

	async getPunishmentLog(id: string): Promise<IPunishmentLog> {
		// @ts-ignore
		if(!id || id == 'cases') return null;

		id = id.replace(/#?([A-Z](\d{6}))/i, '$1').toUpperCase();
        
		const data = (await this.logs.ref(id).once('value')).val() as IPunishmentLog;

		return data || null;
	}

	async setPunishmentLog(id: string, data: IPunishmentLog) {
		// @ts-ignore
		if(!id || id == 'cases') return null;

		id = id.replace(/#?([A-Z](\d{6}))/i, '$1').toUpperCase();

		await this.logs.ref(id).update(data);
	}

	async deletePunishmentLog(id: string) {
		// @ts-ignore
		if(!id || id == 'cases') return null;

		id = id.replace(/#?([A-Z](\d{6}))/i, '$1').toUpperCase();

		await this.logs.ref(id).remove();
	}

	static getData(key: string) {
		return Object.fromEntries(
			Object.entries(process.env)
				.filter(([k]) => keys.includes(`${k}`.replace(`${key}_`, '')))
				.map(([k, v]) => [k.replace(`${key}_`, ''), v])
		);
	}
}

export default Databases;