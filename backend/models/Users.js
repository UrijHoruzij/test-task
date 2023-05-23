const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
		required: true,
	},
	date: { type: String, required: true },
	gender: { type: String, required: true },
});

module.exports = User = mongoose.model('User', UserSchema);
