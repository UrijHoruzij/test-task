const mongoose = require('mongoose');
const UsersModel = require('../models/Users');
const { DB_MONGODB } = require('../config');

class dbMongodb {
	constructor() {
		this.connection = '';
	}

	async init() {
		this.connection = await mongoose.connect(DB_MONGODB, {});
		if (this.connection) console.log('Successfully connecting to MongoDB');
	}

	getUserById = async (_id) => {
		return await UsersModel.findById({ _id: _id });
	};

	checkExistUser = async (email) => {
		return await UsersModel.findOne({ email: email });
	};

	addUser = async (data) => {
		const newUser = new UsersModel(data);
		let userSave = await newUser.save();
		return userSave;
	};

	getAllUsers = async (_id) => {
		const allUsers = await UsersModel.find();
		const users = allUsers.filter((user) => {
			return user._id != _id;
		});
		return users;
	};

	updateUser = async (_id, updateData) => {
		await UsersModel.findByIdAndUpdate(_id, updateData);
		const user = await UsersModel.findById({ _id: _id });
		return user;
	};
}

module.exports = dbMongodb;
