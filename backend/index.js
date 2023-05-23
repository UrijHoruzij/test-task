const cluster = require('./utils/clusters');
const server = require('./utils/server');
const { PORT, CLUSTERS } = require('./config');

const instance = async () => {
	const app = await server();
	app.listen(PORT, (err) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		console.log(`The server is running: ${PORT} stream ${process.pid}`);
	});
};

try {
	if (CLUSTERS) {
		cluster(instance);
	} else {
		instance();
	}
} catch (error) {
	console.log(error);
}
