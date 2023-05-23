import { core } from '../';
import { AUTH_URL } from '../../config';

const userApi = {
	signIn: (postData) => core.signIn(`${AUTH_URL}/signin`, postData),
	signUp: (postData) => core.http(`${AUTH_URL}/signup`, 'POST', postData, {}, true),
	refresh: () => core.refresh(),
	logout: () => core.http(`${AUTH_URL}/logout`, 'POST'),
	editProfile: (profile) => core.http(`${AUTH_URL}/profile`, 'PUT', profile, {}, true),
	getMe: () => core.http(`${AUTH_URL}/user`, 'POST'),
	getAllUsers: () => core.http(`${AUTH_URL}/users`, 'POST'),
};
export default userApi;
