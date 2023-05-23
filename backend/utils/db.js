const dbMongodb = require('./dbMongodb');

const dbconnector = async () => {
	try {
		let database = new dbMongodb();
		await database.init();
		return database;
	} catch (error) {
		console.error('Database connection error');
	}
};
module.exports = dbconnector;
