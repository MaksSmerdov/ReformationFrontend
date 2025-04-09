import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AbilityContext, defineAbilitiesFor } from '@services/ability';

const AdminRoute = ({ children }) => {
	const token = useSelector((state) => state.auth.token);
	const user = useSelector((state) => state.auth.user);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (user) {
			setIsLoading(false);
		}
	}, [user]);

	if (!token) {
		return <Navigate to="/login" />;
	}

	if (isLoading) {
		return null;
	}

	const isAdmin = user && user.roles && user.roles.some((role) => role.name === 'admin');

	if (!isAdmin) {
		return <Navigate to="/dashboard" />;
	}

	return children;
};

export default AdminRoute;
