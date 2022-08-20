import RedisInstance, { Callback, RedisKey } from 'ioredis';

import { APIChannel, APIGuild, APIGuildMember, APIUser, Routes } from 'discord-api-types/v10';

const keysRegex = /^(channels|guilds|users):(\d{16,20}).*?$/;
const guildMemberKeyRegex = /^guilds:\d{16,20}:members:(\d{16,20})$/;

class Redis extends RedisInstance {
	public apollo: Apollo;

	constructor(apollo: Apollo) {
		super(process.env.REDIS_URL);

		Object.defineProperty(this, 'apollo', {
			value: apollo,
			enumerable: false,
			writable: false,
		});
	}

	public async get(key: RedisKey, callback?: Callback<string | null> | undefined): Promise<any | null> {
		const params: any = [key];

		if(callback) {
			params.push(callback);
		}

		// @ts-ignore
		let value: any = await super.get(...params);

		if(value !== null) {
			try {
				value = JSON.parse(value);
			} catch {}
		}
		
		if(value === null) {
			if(keysRegex.test(key.toString())) {
				const execed = keysRegex.exec(key.toString()) as RegExpExecArray;

				const [, type, id] = ([ ...execed ]);

				logger.info(`Cache miss for ${type} with id ${id} (key: ${key.toString()})`, { label: 'Redis' });

				switch (type) {
					case 'guilds': {
						const guildId = id;

						if(guildMemberKeyRegex.test(key.toString())) {
							const [, userId] = [ ...(guildMemberKeyRegex.exec(key.toString()) as Array<string>) ];

							const { user, ...member } = await this.apollo.apis.discord.get(Routes.guildMember(guildId, userId == '@me' ? process.env.DISCORD_CLIENT_ID : userId)) as APIGuildMember;

							if(user !== undefined) {
								this.set(`users:${userId}`, user);
							}

							await this.set(`guilds:${guildId}:members:${userId}`, member);

							value = member;
						} else {
							const guild = await this.apollo.apis.discord.get(Routes.guild(guildId)) as APIGuild;
	
							const channels = await this.apollo.apis.discord.get(Routes.guildChannels(guildId)) as Array<APIChannel>;
	
							value = await this.set(`guilds:${guildId}`, { ...guild, channels });
						}

						break;
					}

					case 'users': {
						const userId = id;

						const user = await this.apollo.apis.discord.get(Routes.user(userId)) as APIUser;

						await this.set(`users:${userId}`, user);

						value = user;

						break;
					}
				}
			}
		}
		
		return value;
	}

	// @ts-ignore
	public async set(key: RedisKey, value: string | number | Buffer | Array | Object, get?: 'GET', callback?: Callback<string | null> | undefined) {
		if(typeof value === 'object' && value !== null && !Buffer.isBuffer(value)) {
			value = JSON.stringify(value);
		}
		
		const params = [key, value];

		if(get) {
			params.push(get);
		}

		if(callback) {
			params.push(callback);
		}

		// @ts-ignore
		return super.set(...params);
	}
}

export default Redis;