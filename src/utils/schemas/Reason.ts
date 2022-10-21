import Schema from '../Schema';

const ReasonSchema = new Schema({
	id: {
		_type: String,
		nullable: true,
	},
	text: String,
	keys: [String],
	types: [String],
	duration: {
		_type: Number,
		nullable: true,
	},
	days: {
		_type: Number,
		nullable: true,
	},
});

export { ReasonSchema };