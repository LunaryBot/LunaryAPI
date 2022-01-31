import firebase from "firebase";
require("dotenv").config();

const keys = ['apiKey', 'appId', 'authDomain', 'databaseURL', 'measurementId', 'messagingSenderId', 'projectId', 'storageBucket']
interface IAppData {
    apiKey: string,
    appId: string,
    authDomain: string,
    databaseURL: string,
    measurementId: string,
    messagingSenderId: string,
    projectId: string,
    storageBucket: string
}

class Databases {
    guilds: firebase.database.Database;
    constructor() {
        this.guilds = this.initializeDatabase('GuildsDB');
    }

    initializeDatabase(name: string): firebase.database.Database {
        let app = firebase.apps.find((app: firebase.app.App) => app.name == name);

        if(!app) {
            app = firebase.initializeApp(Databases.getData(name), name);
        };
        return app.database();
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