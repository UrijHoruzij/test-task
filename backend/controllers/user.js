const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SECRET } = require('../config.js');

class user {
	constructor(database) {
		this.database = database;
	}

	async getMe(req, res) {
		const { accessToken } = req.body;
		try {
			const decoded = jwt.verify(accessToken, SECRET);
			const user = await this.database.getUserById(decoded._id);
			if (!user) {
				return res.status(400).send({
					status: 'FAILURE',
					message: 'The user exists.',
				});
			}
			const me = {
				_id: user._id,
				name: user.name,
				date: user.date,
				avatar: user.avatar,
			};
			return res.status(200).send({
				status: 'SUCCESSFUL',
				user: me,
			});
		} catch (error) {
			return res.status(500).send({
				status: 'FAILURE',
				message: 'Server error.',
			});
		}
	}
	async getAllUsers(req, res) {
		const { accessToken } = req.body;
		try {
			const decoded = jwt.verify(accessToken, SECRET);
			const allUsers = await this.database.getAllUsers(decoded._id);
			if (!allUsers) {
				return res.status(400).send({
					status: 'FAILURE',
					message: 'The users exists.',
				});
			}
			return res.status(200).send({
				status: 'SUCCESSFUL',
				users: allUsers,
			});
		} catch (error) {
			return res.status(500).send({
				status: 'FAILURE',
				message: 'Server error.',
			});
		}
	}

	async setProfile(req, res) {
		const { accessToken, name, password } = req.body;
		const avatar = req.file;
		try {
			const decoded = jwt.verify(accessToken, SECRET);
			if (avatar) {
				await this.database.updateUser(decoded._id, { avatar: avatar.filename });
			}
			if (password) {
				bcrypt.hash(password, 10, async (err, hash) => {
					await this.database.updateUser(decoded._id, { password: hash });
				});
			}
			if (name) {
				await this.database.updateUser(decoded._id, { name: name });
			}
			const user = await this.database.getUserById(decoded._id);
			if (!user) {
				return res.status(400).send({
					status: 'FAILURE',
					message: 'The user exists.',
				});
			}
			return res.status(200).send({
				status: 'SUCCESSFUL',
				message: 'Profile updated',
				user: user,
			});
		} catch (error) {
			return res.status(500).send({
				status: 'FAILURE',
				message: 'Server error.',
			});
		}
	}
}

module.exports = user;
