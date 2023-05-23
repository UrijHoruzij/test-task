import { userApi } from '../../core/api';

const Actions = {
	setUsersData: (data) => ({
		type: 'USERS:SET_DATA',
		payload: data,
	}),

	getUsers: () => async (dispatch) => {
		try {
			const data = await userApi.getAllUsers();
			if (data && data.status === 'SUCCESSFUL') dispatch(Actions.setUsersData(data.users));
			return data;
		} catch (error) {
			console.error(error);
		}
	},
};

export default Actions;
