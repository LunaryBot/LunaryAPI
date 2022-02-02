import firebase from "firebase";
require("dotenv").config();

const keys = ['apiKey', 'appId', 'authDomain', 'databaseURL', 'measurementId', 'messagingSenderId', 'projectId', 'storageBucket']

class Databases {
    guilds: firebase.database.Database;
   
    logs: firebase.database.Database;
    constructor() {
        this.guilds = this.initializeDatabase('GuildsDB');
        this.logs = this.initializeDatabase('LogsDB');
    }

    initializeDatabase(name: string): firebase.database.Database {
        let app = firebase.apps.find((app: firebase.app.App) => app.name == name);

        if(!app) {
            app = firebase.initializeApp(Databases.getData(name), name);
        };
        return app.database();
    }

    async getGuildDatabase(guildId: string) {
        const db = await this.guilds.ref(`Servers/${guildId}`).once("value");
        return db.val() || {};
    }

    async getLogs() {
        const db = await this.logs.ref().once("value");
        return db.val() || {};
    }

    static getData(key: string) {
        return Object.fromEntries(
            Object.entries(process.env)
                .filter(([k]) => keys.includes(`${k}`.replace(`${key}_`, '')))
                .map(([k, v]) => [k.replace(`${key}_`, ''), v])
        )
    }
}

export default Databases;