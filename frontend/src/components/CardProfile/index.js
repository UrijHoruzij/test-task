import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Typography, Card, Space } from 'antd';
import { AUTH_URL } from '../../config';
import styles from './CardProfile.module.css';
const { Title, Text } = Typography;

const CardProfile = (props) => {
	const { avatar, name, date } = props;
	const calculateAge = (date) => {
		const birthDate = new Date(date);
		const otherDate = new Date();
		let years = otherDate.getFullYear() - birthDate.getFullYear();
		if (
			otherDate.getMonth() < birthDate.getMonth() ||
			(otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate())
		) {
			years--;
		}
		return years;
	};
	return (
		<Card className={styles.card}>
			<Avatar src={`${AUTH_URL}/uploads/${avatar}`} size={96} icon={<UserOutlined />} />
			<Title className={styles.name} level={4}>
				{name}
			</Title>
			<Text className={styles.date}>{calculateAge(date)} лет</Text>
		</Card>
	);
};

export default CardProfile;
