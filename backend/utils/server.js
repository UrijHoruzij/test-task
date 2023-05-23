const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const multer = require('multer');
const dbConnector = require('./db');

const server = async () => {
	const app = express();
	const db = await dbConnector();
	if (!db) {
		throw 'Error! Database not found. ';
	}
	app.use(passport.initialize());
	require('./passport-config')(passport, db);
	let allowedOrigins = ['http://localhost:3000', 'http://localhost:7000'];
	app.use(
		cors({
			origin: (origin, callback) => {
				if (!origin) return callback(null, true);
				if (allowedOrigins.indexOf(origin) === -1) {
					let msg = 'The CORS policy for this site does not ' + 'allow access from the specified Origin.';
					return callback(new Error(msg), false);
				}
				return callback(null, true);
			},
		}),
	);
	app.use(cookieParser());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(express.static(__dirname));
	app.use('/uploads', express.static('uploads'));
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, 'uploads/');
		},
		filename: function (req, file, cb) {
			cb(null, Date.now() + path.extname(file.originalname));
		},
	});
	const upload = multer({
		storage: storage,
		limits: {
			fileSize: 5 * 1024 * 1024,
		},
		fileFilter: (req, file, cb) => {
			if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
				return cb(new Error('Only image are allowed.'), false);
			}
			cb(null, true);
		},
	});

	const authClass = require('../controllers/auth');
	const auth = new authClass(db);

	const userClass = require('../controllers/user');
	const user = new userClass(db);

	app.post('/signup', upload.single('avatar'), (req, res) => {
		auth.signup(req, res);
	});
	app.post('/signin', (req, res) => {
		auth.signin(req, res);
	});
	app.post('/refresh', (req, res) => {
		auth.refresh(req, res);
	});
	app.post('/verify', (req, res) => {
		auth.verify(req, res);
	});
	app.post('/logout', (req, res) => {
		auth.logout(req, res);
	});
	app.post('/user', (req, res) => {
		user.getMe(req, res);
	});
	app.post('/users', (req, res) => {
		user.getAllUsers(req, res);
	});
	app.put('/profile', upload.single('avatar'), (req, res) => {
		user.setProfile(req, res);
	});
	return app;
};
module.exports = server;
