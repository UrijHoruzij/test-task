import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Auth, Home, Account } from './pages';

const App = (props) => {
	const { isAuth } = props;
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Auth isAuth={isAuth} />} />
				<Route path="/people" element={<Home isAuth={isAuth} />} />
				<Route path="/account" element={<Account isAuth={isAuth} />} />
			</Routes>
		</BrowserRouter>
	);
};

export default connect(({ user }) => ({ isAuth: user.isAuth }))(App);
