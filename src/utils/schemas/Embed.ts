import Schema, { SchemaOption, SchemaType, SchemaTypeBase } from '../Schema';

const imageBase = {
	url: make(String),
	proxy_url: make(String),
	height: make(Number),
	width: make(Number),
};

const EmbedSchema = new Schema({
	content: make(String),
	embeds: make([
		{
			title: make(String, 256),
			description: make(String, 4096),
			url: make(String),
			timestamp: make(Boolean),
			color: make(Number),
			footer: {
				text: make(String, 2048),
				icon_url: make(String),
				proxy_icon_url: make(String),
			},
			image: imageBase,
			thumbnail: imageBase,
			author: {
				name: make(String, 256),
				url: make(String),
				icon_url: make(String),
				proxy_icon_url: make(String),
			},
			fields: make([
				{
					name: make(String, 256, false),
					value: make(String, 1024, false),
					inline: make(Boolean),
				},
			]),
		},
	]),
});

export { EmbedSchema };

function make(_type: SchemaTypeBase, maxLength: number | undefined = undefined, nullable = true): SchemaOption {
	const middleware = typeof maxLength == 'number' ? (value?: string) => value?.shorten(maxLength) : undefined;
	
	return { _type, nullable, middleware };
}