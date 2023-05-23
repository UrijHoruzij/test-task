const initialState = {
	data: null,
	isAuth: !true,
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case 'USER:SET_DATA':
			return {
				...state,
				data: payload,
				isAuth: true,
			};
		case 'USER:SET_IS_AUTH':
			return {
				...state,
				isAuth: payload,
			};
		default:
			return state;
	}
};
