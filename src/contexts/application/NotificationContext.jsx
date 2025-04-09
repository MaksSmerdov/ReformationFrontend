import { createContext, useState, useContext } from 'react';
import Notification from '@components/common/basic/Notification';

const NotificationContext = createContext();

const useNotification = () => useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState([]);

	const addNotification = (message, variant) => {
		const id = Date.now();
		setNotifications((prev) => [...prev, { id, message, variant }]);
	};

	const removeNotification = (id) => {
		setNotifications((prev) => prev.filter((notification) => notification.id !== id));
	};

	return (
		<NotificationContext.Provider value={{ addNotification }}>
			{children}
			<div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
				{notifications.map(({ id, message, variant }) => (
					<Notification key={id} id={id} message={message} variant={variant} removeNotification={removeNotification} />
				))}
			</div>
		</NotificationContext.Provider>
	);
};

export { NotificationProvider, useNotification };
