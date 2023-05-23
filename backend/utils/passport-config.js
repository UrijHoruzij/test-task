const { Strategy, ExtractJwt } = require('passport-jwt');
const { SECRET } = require('../config.js');

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: SECRET,
};

const JWTStrategy = (passport, db) => {
	passport.use(
		new Strategy(opts, async (payload, done) => {
			const user = db.getUserById(payload._id);
			if (user) {
				return done(null, {
					_id: user._id,
				});
			} else {
				return done(null, false);
			}
		}),
	);
};

module.exports = JWTStrategy;
