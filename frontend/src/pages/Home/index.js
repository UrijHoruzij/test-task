import React from 'react';
import { connect } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Typography, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { userActions } from '../../redux/actions';
import { AUTH_URL } from '../../config';
import { CardProfile } from '../../components';
import store from '../../redux/store';
import styles from './Home.module.css';
import bg from '../bg.jpg';

const { Title, Text } = Typography;

const Home = (props) => {
	const { isAuth, user, users } = props;
	const navigate = useNavigate();
	if (!isAuth) {
		navigate('/');
	}
	const navigateAccount = () => {
		navigate('/account');
	};
	const handleLogout = async () => {
		await store.dispatch(userActions.logout());
	};
	return (
		<div style={{ background: `url(${bg})`, backgroundSize: 'cover' }} className={styles.home}>
			<Card className={styles.wrapper}>
				<div className={styles.profile}></div>
				{user && (
					<div className={styles.account}>
						<Avatar
							className={styles.accountAvatar}
							onClick={navigateAccount}
							src={`${AUTH_URL}/uploads/${user.avatar}`}
							size={80}
							icon={<UserOutlined />}
						/>
						<div className={styles.accountContent}>
							<Title className={styles.accountLink} onClick={navigateAccount} level={3}>
								{user.name}
							</Title>
							<Text onClick={handleLogout} className={styles.accountLink}>
								Выход
							</Text>
						</div>
					</div>
				)}
				<Title level={2}>Пользователи</Title>
				<div className={styles.content}>
					{users &&
						users.map((item) => <CardProfile avatar={item.avatar} name={item.name} date={item.date} key={item._id} />)}
				</div>
			</Card>
		</div>
	);
};

export default connect(
	({ user, users }) => ({
		user: user.data,
		users: users.data,
	}),
	userActions,
)(Home);
