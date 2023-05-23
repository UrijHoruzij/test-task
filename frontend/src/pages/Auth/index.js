import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row, Button, Input, Typography, Form, DatePicker, Select, Card, message } from 'antd';
import { userActions, usersActions } from '../../redux/actions';
import store from '../../redux/store';
import styles from './Auth.module.css';
import bg from '../bg.jpg';
const { Title } = Typography;

const Auth = (props) => {
	const { isAuth } = props;
	const navigate = useNavigate();
	const [valuesSignIn, setValuesSignIn] = useState({ email: '', password: '' });
	const [valuesSignUp, setValuesSignUp] = useState({
		email: '',
		name: '',
		password: '',
		date: '',
		gender: 'men',
		avatar: '',
	});
	const [messageApi, contextHolder] = message.useMessage();
	const info = () => {};
	if (isAuth) {
		store.dispatch(userActions.getUser());
		store.dispatch(usersActions.getUsers());
		navigate('/people');
	}
	const handleSubmitSignIn = async () => {
		await store.dispatch(userActions.fetchUserLogin(valuesSignIn));
	};
	const handleSubmitSignUp = async () => {
		if (valuesSignUp.avatar !== '') {
			const formData = new FormData();
			for (let key in valuesSignUp) {
				formData.append(key, valuesSignUp[key]);
			}
			const data = await store.dispatch(userActions.fetchUserRegister(formData));
			if (data && data.status === 'SUCCESSFUL') messageApi.info('Пользователь зарегистрирован');
		}
	};
	const handleUploadAvatar = async (e) => {
		let valuesCopy = Object.assign({}, valuesSignUp);
		valuesCopy['avatar'] = e.target.files[0];
		setValuesSignUp(valuesCopy);
	};
	const handleChangeDate = (date, dateString) => {
		let valuesCopy = Object.assign({}, valuesSignUp);
		valuesCopy['date'] = date.$d;
		setValuesSignUp(valuesCopy);
	};
	const handleChangeGender = (gender) => {
		let valuesCopy = Object.assign({}, valuesSignUp);
		valuesCopy['gender'] = gender;
		setValuesSignUp(valuesCopy);
	};
	const handleChangeSignIn = (e) => {
		let inputName = e.target.name;
		let inputValue = e.target.value;
		let valuesCopy = Object.assign({}, valuesSignIn);
		valuesCopy[inputName] = inputValue;
		setValuesSignIn(valuesCopy);
	};
	const handleChangeSignUp = (e) => {
		let inputName = e.target.name;
		let inputValue = e.target.value;
		let valuesCopy = Object.assign({}, valuesSignUp);
		valuesCopy[inputName] = inputValue;
		setValuesSignUp(valuesCopy);
	};
	return (
		<>
			{contextHolder}
			<div style={{ background: `url(${bg})`, backgroundSize: 'cover' }} className={styles.auth}>
				<div className={styles.wrapper}>
					<Card className={styles.card}>
						<Title level={1}>Вход</Title>
						<Form className={styles.form} onSubmit={handleSubmitSignIn}>
							<Input
								className={styles.space}
								name="email"
								placeholder="E-Mail"
								value={valuesSignIn.email}
								onChange={handleChangeSignIn}
							/>
							<Input
								className={styles.space}
								name="password"
								type="password"
								placeholder="Пароль"
								value={valuesSignIn.password}
								onChange={handleChangeSignIn}
							/>
							<Button className={styles.btn} size="large" type="primary" onClick={handleSubmitSignIn}>
								Войти
							</Button>
						</Form>
					</Card>
					<Card className={styles.card}>
						<Title level={1}>Регистрация</Title>
						<Form className={styles.form} onSubmit={handleSubmitSignUp}>
							<Input className={styles.space} type="file" onChange={handleUploadAvatar}></Input>
							<Input
								className={styles.space}
								name="name"
								placeholder="Имя"
								value={valuesSignUp.name}
								onChange={handleChangeSignUp}
							/>
							<Input
								className={styles.space}
								name="email"
								placeholder="E-mail"
								value={valuesSignUp.email}
								onChange={handleChangeSignUp}
							/>
							<Input
								className={styles.space}
								name="password"
								type="password"
								placeholder="Придумайте пароль"
								value={valuesSignUp.password}
								onChange={handleChangeSignUp}
							/>
							<div className={styles.rowForm}>
								<DatePicker className={styles.space} onChange={handleChangeDate} />
								<Select
									className={styles.space}
									defaultValue="Мужчина"
									placeholder="Пол"
									name="gender"
									onChange={handleChangeGender}
									options={[
										{ value: 'men', label: 'Мужчина' },
										{ value: 'women', label: 'Женщина' },
									]}
								/>
							</div>
							<Button className={styles.btn} size="large" type="primary" onClick={handleSubmitSignUp}>
								Зарегистрироваться
							</Button>
						</Form>
					</Card>
				</div>
				<Row gutter={16}>
					<Col span={12}></Col>
					<Col span={12}></Col>
				</Row>
			</div>
		</>
	);
};

export default Auth;
