import { useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const Notification = ({ id, message, variant, removeNotification }) => {
	useEffect(() => {
		const timer = setTimeout(() => removeNotification(id), 10000);
		return () => clearTimeout(timer);
	}, [id, removeNotification]);

	return (
		<Alert variant={variant} onClose={() => removeNotification(id)} dismissible className="mb-2">
			{message}
		</Alert>
	);
};

export default Notification;
