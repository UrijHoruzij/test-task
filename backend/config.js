module.exports = {
	CLUSTERS: false,
	PORT: 7000,
	DB_MONGODB: 'mongodb://localhost/test-task',
	ACCESS_TOKEN_TIME: '900s',
	REFRESH_TOKEN_TIME: '7d',
	SECRET: 'seckret',
	SECRET_REFRESH: 'secretRefresh',
	COOKIE_CONFIG: { httpOnly: true },
};
