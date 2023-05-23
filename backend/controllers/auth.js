const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET, ACCESS_TOKEN_TIME, SECRET_REFRESH, REFRESH_TOKEN_TIME, COOKIE_CONFIG } = require('../config.js');

class auth {
	constructor(database) {
		this.database = database;
	}

	createAccessToken(user, refresh) {
		return {
			...user,
			status: 'SUCCESSFUL',
			accessToken: jwt.sign(user, SECRET, {
				expiresIn: ACCESS_TOKEN_TIME,
			}),
			accessTokenTime: ACCESS_TOKEN_TIME,
			refreshToken: refresh,
		};
	}

	createRefreshToken(user) {
		const refreshToken = jwt.sign(user, SECRET_REFRESH, {
			expiresIn: REFRESH_TOKEN_TIME,
		});
		return refreshToken;
	}

	async verify(req, res) {
		try {
			const { accessToken } = req.body;
			const decoded = await jwt.verify(accessToken, SECRET);
			if (decoded) {
				return res.status(200).send({
					status: 'SUCCESSFUL',
					message: 'The token is valid.',
				});
			}
		} catch {
			return res.status(401).send({
				status: 'FAILURE',
				message: 'The token is not valid.',
			});
		}
	}

	async signup(req, res) {
		const { email, password, name, date, gender } = req.body;
		const avatar = req.file;
		const user = await this.database.checkExistUser(email);
		if (user) {
			return res.status(400).send({
				status: 'FAILURE',
				message: 'The user exists.',
			});
		} else {
			bcrypt.hash(password, 10, async (err, hash) => {
				if (err) {
					res.status(500).send({
						status: 'FAILURE',
						message: err,
					});
				}
				const newUser = {
					email: email,
					password: hash,
					name: name,
					date: date,
					avatar: avatar.filename,
					gender: gender,
				};
				let userSave = await this.database.addUser(newUser);
				if (userSave) {
					return res.status(201).send({
						status: 'SUCCESSFUL',
						message: 'The user is created.',
					});
				} else {
					return res.status(500).send({
						status: 'FAILURE',
						message: 'Server error.',
					});
				}
			});
		}
		try {
		} catch {
			return res.status(500).send({
				status: 'FAILURE',
				message: 'Server error.',
			});
		}
	}

	async signin(req, res) {
		try {
			const { email, password } = req.body;
			const user = await this.database.checkExistUser(email);
			if (!user) {
				return res.status(404).send({
					status: 'FAILURE',
					message: 'The user is not found.',
				});
			}
			const isMatch = await bcrypt.compare(password, user.password);
			if (isMatch) {
				const userInfo = {
					_id: user._id,
				};
				let refresh = this.createRefreshToken(userInfo);
				res.cookie('refreshToken', refresh, COOKIE_CONFIG);
				return res.status(200).send(this.createAccessToken(userInfo, refresh));
			} else {
				return res.status(400).send({ status: 'FAILURE', message: 'Wrong password.' });
			}
		} catch {
			return res.status(500).send({
				status: 'FAILURE',
				message: 'Server error.',
			});
		}
	}

	async refresh(req, res) {
		try {
			let refreshToken = req.cookies.refreshToken || req.body.refreshToken;
			const decoded = await jwt.verify(refreshToken, SECRET_REFRESH);
			if (decoded) {
				const userInfo = {
					_id: decoded._id,
					name: decoded.name,
				};
				let refresh = this.createRefreshToken(userInfo);
				res.cookie('refreshToken', refresh, COOKIE_CONFIG);
				return res.status(200).send(this.createAccessToken(userInfo, refresh));
			}
		} catch (err) {
			res.clearCookie('refreshToken');
			return res.status(500).send({
				status: 'FAILURE',
				message: 'Server error.',
				err: err,
			});
		}
	}
	async logout(req, res) {
		try {
			const { accessToken } = req.body;
			await jwt.verify(accessToken, SECRET);
			res.clearCookie('refreshToken');
			return res.status(200).send({
				status: 'SUCCESSFUL',
				message: 'User logged out.',
			});
		} catch {
			return res.status(401).send({
				status: 'FAILURE',
				message: 'The token is not valid.',
			});
		}
	}
}

module.exports = auth;
