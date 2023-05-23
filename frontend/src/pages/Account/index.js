import { useState } from 'react';
import { connect } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Typography, Button, Input, Space, Modal, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { userActions } from '../../redux/actions';
import { AUTH_URL } from '../../config';
import store from '../../redux/store';
import bg from '../bg.jpg';
import styles from './Account.module.css';

const { Title, Text } = Typography;

const Account = (props) => {
	const { isAuth, user } = props;
	const navigate = useNavigate();
	const [values, setValues] = useState({
		name: '',
		password: '',
		avatar: '',
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	if (!isAuth) {
		navigate('/');
	}
	const navigateHome = () => {
		navigate('/people');
	};
	const handleSubmit = async () => {
		const formData = new FormData();
		for (let key in values) {
			formData.append(key, values[key]);
		}
		await store.dispatch(userActions.editProfile(formData));
	};
	const handleUploadAvatar = async (e) => {
		let valuesCopy = Object.assign({}, values);
		valuesCopy['avatar'] = e.target.files[0];
		setValues(valuesCopy);
	};
	const handleChange = async (e) => {
		let inputName = e.target.name;
		let inputValue = e.target.value;
		let valuesCopy = Object.assign({}, values);
		valuesCopy[inputName] = inputValue;
		setValues(valuesCopy);
	};

	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = async () => {
		await handleSubmit();
		let valuesCopy = Object.assign({}, values);
		valuesCopy['name'] = user.name;
		valuesCopy['password'] = '';
		valuesCopy['avatar'] = '';
		setValues(valuesCopy);
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};
	return (
		<div style={{ background: `url(${bg})`, backgroundSize: 'cover' }} className={styles.account}>
			<Card className={styles.wrapper}>
				<Button onClick={navigateHome}>Назад</Button>
				{user ? (
					<div className={styles.profile}>
						<Avatar shape="square" src={`${AUTH_URL}/uploads/${user.avatar}`} size={300} icon={<UserOutlined />} />
						<div className={styles.content}>
							<Title className={styles.name} level="2">{user.name}</Title>
							<Text className={styles.date}>{new Date(user.date).toLocaleDateString()}</Text>
							<Button className={styles.editBtn} type="primary" onClick={showModal}>
								Редактировать
							</Button>
						</div>
					</div>
				) : null}

				<Modal
					title="Профиль"
					open={isModalOpen}
					onOk={handleOk}
					onCancel={handleCancel}
					footer={[
						<Button key="submit" type="primary" onClick={handleOk}>
							Сохранить
						</Button>,
					]}>
					<Space direction="vertical">
						<Input name="avatar" placeholder="Аватар" type="file" onChange={handleUploadAvatar}></Input>
						<Input name="name" placeholder="Имя" value={values.name} onChange={handleChange} />
						<Input
							name="password"
							type="password"
							placeholder="Придумайте новый пароль"
							value={values.password}
							onChange={handleChange}
						/>
					</Space>
				</Modal>
			</Card>
		</div>
	);
};

export default connect(
	({ user }) => ({
		user: user.data,
	}),
	userActions,
)(Account);
