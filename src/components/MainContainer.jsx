import { useState, createContext } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@components/interface/Header';
import PrivateRoute from '@routes/PrivateRoute';
import { useNotification } from '@contexts/application/NotificationContext';

const MainContainer = () => {
	const { addNotification, removeNotification } = useNotification();

	return (
		<PrivateRoute>
			<Header />
			<Outlet />
		</PrivateRoute>
	);
};

export default MainContainer;
