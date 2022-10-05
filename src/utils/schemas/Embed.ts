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
			title: make(String),
			description: make(String),
			url: make(String),
			timestamp: make(Boolean),
			color: make(Number),
			footer: {
				text: make(String),
				icon_url: make(String),
				proxy_icon_url: make(String),
			},
			image: imageBase,
			thumbnail: imageBase,
			author: {
				name: make(String),
				url: make(String),
				icon_url: make(String),
				proxy_icon_url: make(String),
			},
			fields: make([{
				name: make(String, false),
				value: make(String, false),
				inline: make(Boolean),
			},
			]),
		},
	]),
});

export { EmbedSchema };

function make(_type: SchemaTypeBase, nullable = true): SchemaOption {
	return { _type, nullable };
}