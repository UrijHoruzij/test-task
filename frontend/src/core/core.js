import { AUTH_URL } from '../config';

function Core(url) {
	let accessToken = '';
	let refreshToken = '';
	let authUser = '';
	let user = '';
	let accessTokenTime = '';
	let second = 0;
	let urlRefresh = url;
	let errorNet = false;
	setInterval(() => {
		timer();
	}, 1000);
	this.SetAccessToken = (newValue) => {
		accessToken = newValue;
	};
	this.SetRefreshToken = (newValue) => {
		refreshToken = newValue;
	};
	this.SetUser = (newValue) => {
		user = newValue;
	};
	this.GetAuthUser = () => {
		return authUser;
	};
	const getHeaders = (headers = {}, isSignUp = false) => {
		let obj = {};
		for (let key in headers) {
			obj[key] = headers[key];
		}
		obj['accessToken'] = accessToken;
		obj['user'] = user;
		if (!isSignUp) obj['Content-Type'] = 'application/json';
		return obj;
	};
	this.signIn = async (url, data) => {
		try {
			let response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: getHeaders(),
			});
			if (response.ok) {
				return GetResult(response);
			} else {
				throw new Error('Error sign in.');
			}
		} catch (error) {
			console.error(error);
		}
	};
	this.refresh = async () => {
		try {
			let response = await fetch(urlRefresh, {
				method: 'POST',
				body: JSON.stringify({
					refreshToken: refreshToken,
				}),
				headers: getHeaders(),
			});
			if (response.ok) {
				return GetResult(response);
			} else {
				accessToken = '';
				accessTokenTime = '';
				user = '';
				errorNet = true;
				throw new Error('Error refresh.');
			}
		} catch (error) {
			console.error(error);
		}
	};
	const timerReconnection = () => {
		let timerId = setInterval(async () => {
			await this.refresh();
			if (errorNet === false) {
				clearInterval(timerId);
			}
		}, 10000);
	};
	const timer = () => {
		if (accessTokenTime !== '') {
			second++;
			if (String(second) + 's' === accessTokenTime) {
				second = 0;
				this.refresh();
			}
		}
	};
	const GetResult = async (response) => {
		let result = await response.json();
		accessToken = result.accessToken;
		accessTokenTime = result.accessTokenTime;
		refreshToken = result.refreshToken;
		authUser = result._id;
		errorNet = false;
		let obj = {};
		for (let key in result) {
			if (key !== 'accessToken' || key !== 'accessTokenTime' || key !== 'refreshToken') {
				obj[key] = result[key];
			}
		}
		return obj;
	};
	this.http = async (url, method = 'GET', data = {}, headers = {}, isSignUp = false) => {
		try {
			let options = {
				headers: getHeaders(headers, isSignUp),
			};
			if (method !== 'GET') {
				options['method'] = method;
				if (isSignUp) {
					data.append('accessToken', accessToken);
					options['body'] = data;
				} else {
					data.accessToken = accessToken;
					options['body'] = JSON.stringify(data);
				}
			}
			let response = await fetch(url, options);
			if (response.ok) {
				let result;
				switch (options.headers.responseType) {
					case 'blob':
						result = await response.blob();
						break;
					case 'text':
						result = await response.text();
						break;
					case 'json':
						result = await response.json();
						break;
					case 'formdata':
						result = await response.formData();
						break;
					case 'arraybuffer':
						result = await response.arrayBuffer();
						break;
					default:
						result = await response.json();
						break;
				}
				return result;
			} else {
				if (response.status === 'FAILURE' && errorNet === false) {
					await this.refresh();
					this.http(url, method, data);
				} else {
					timerReconnection();
				}
				throw new Error('Error http.');
			}
		} catch (error) {
			console.error(error);
		}
	};
}
let obj = new Core(`${AUTH_URL}/refresh`);

export default obj;
