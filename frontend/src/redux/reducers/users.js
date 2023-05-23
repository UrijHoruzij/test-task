const initialState = {
	data: null,
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case 'USERS:SET_DATA':
			return {
				...state,
				data: payload,
			};
		default:
			return state;
	}
};
