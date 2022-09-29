import { Embed, EmbedType } from '@prisma/client';

import { APIEmbed } from 'discord-api-types/v10';

const az = [ ...'abcdefghijklmnopqrstuvwxyz' ];

interface EmbedFormated extends Omit<APIEmbed, 'type'> {
	type: EmbedType;
	guild_id: string;
	content?: string;
}

class Utils {
	public static formatDatabaseEmbed(embed: Embed) {
		const dataFormated: any = {};
		  
		Object.entries(embed).map(([key, value]) => {
			if(value == null || key == 'guild_id') return;
			
			const inEmbed = key.startsWith('embed_');

			if(inEmbed && !dataFormated.embed) {
				dataFormated.embed = {};
			}
	
			key = key.replace('embed_', '');
				
			const [parent, ...keys] = key.split('_');
	
			const d = inEmbed ? dataFormated.embed : dataFormated;
			
			if(!keys.length) d[parent] = value;
			else {
				const refKey = keys.join('_');
	
				if(!d[parent]) {
					d[parent] = {};
				}
	
				const ref = d[parent];
				  
				ref[refKey] = value;
			}
		});
		  
		return { ...dataFormated, guild_id: embed.guild_id } as EmbedFormated;
	}

	public static formatHumanPunishmentId(punishmentsCount: number): string {
		const a = (punishmentsCount + 1) % 1000000;

		const id = az[Math.floor((punishmentsCount + 1) / 1000000)].toUpperCase() + '0'.repeat(6 - a.toString().length) + a;
        
		return id;
	}

	public static formatDatabasePunishmentId(punishmentId: string) {
		punishmentId = punishmentId.replace(/^#/, '');

		const letter = punishmentId.charAt(0);

		const number = punishmentId.substring(1);

		return Number(`${az.indexOf(letter.toLowerCase())}${number}`);
	}

	public static isPremium(premiumUntil?: Date | null) {
		return premiumUntil && premiumUntil.getTime() >= Date.now();
	}
}

export { Utils };