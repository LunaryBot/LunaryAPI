import { Client } from 'eris';
import { Router } from 'express';

import BaseRouter from '../structures/BaseRouter';
import Databases from '../structures/Databases';
import Server from '../structures/Server';

import Utils from '../utils/Utils';

import { IPunishmentLogsFilter } from '../@types';

class MainRouter extends BaseRouter {
    constructor(data: { dbs: Databases; server: Server, client: Client }) {
        super({
            server: data.server,
            router: Router(),
            dbs: data.dbs,
            path: '/',
            client: data.client
        });

        this.get('/punishments', async(req, res) => {
            const logs = await this.dbs.getPunishmentLogs();

            const filters = (req.query as any || {}) as IPunishmentLogsFilter;

            if(filters.limit) {
                filters.limit = Number(filters.limit);
            }

            if(filters.type) {
                filters.type = Number(filters.type) ?? filters.type;
            }

            try {
                const resolvedPunishmentLogs = await Utils.resolvePunishmentLogs(logs, filters);

                res.status(200).json(resolvedPunishmentLogs);
            } catch (err: any) {
                console.log(err.message);
            }
        });
    }
}

export default MainRouter;