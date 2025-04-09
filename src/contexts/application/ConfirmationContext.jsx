import { createContext, useState, useContext } from 'react';
import ConfirmationModal from '@components/common/modal/ConfirmationModal';

const ConfirmationContext = createContext();

export const useConfirmation = () => useContext(ConfirmationContext);

const ConfirmationProvider = ({ children }) => {
	const [confirmation, setConfirmation] = useState({
		show: false,
		message: '',
		onConfirm: () => {}
	});

	const showConfirmation = (message, onConfirm) => {
		setConfirmation({ show: true, message, onConfirm });
	};

	const hideConfirmation = () => {
		setConfirmation({ show: false, message: '', onConfirm: () => {} });
	};

	return (
		<ConfirmationContext.Provider value={{ showConfirmation, hideConfirmation }}>
			{children}
			<ConfirmationModal
				show={confirmation.show}
				onHide={hideConfirmation}
				onConfirm={() => {
					confirmation.onConfirm();
					hideConfirmation();
				}}
				message={confirmation.message}
			/>
		</ConfirmationContext.Provider>
	);
};

export { ConfirmationContext, ConfirmationProvider };
