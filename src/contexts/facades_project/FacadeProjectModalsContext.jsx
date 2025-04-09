import { createContext, useContext, useState } from 'react';
import FacadeGroupModal from '@components/project/facades/modals/FacadeGroupModal';
import FacadeModal from '@components/project/facades/modals/FacadeModal';
import { useDispatch } from 'react-redux';
import { deleteGroupFacade } from '@slices/facades/groupFacadesSlice';
import { deleteFacade } from '@slices/facades/facadesSlice';
import { useNotification } from '@contexts/application/NotificationContext';

const FacadeProjectModalsContext = createContext();

export const FacadeProjectModalsProvider = ({ children }) => {
	const dispatch = useDispatch();
	const { addNotification } = useNotification();

	const [editingFacadeGroupId, setEditingFacadeGroupId] = useState(null);
	const [showGroupFacadeModal, setShowGroupFacadeModal] = useState(false);
	const [isCreatingGroupFacade, setIsCreatingGroupFacade] = useState(false);

	const [editingFacadeId, setEditingFacadeId] = useState(null);
	const [showFacadeModal, setShowFacadeModal] = useState(false);
	const [isCreatingFacade, setIsCreatingFacade] = useState(false);

	const handleEditGroupFacade = async (groupFacadeId) => {
		setEditingFacadeGroupId(groupFacadeId);
		setIsCreatingGroupFacade(false);
		setShowGroupFacadeModal(true);
	};

	const handleCreateGroupFacade = async () => {
		setEditingFacadeGroupId(null);
		setIsCreatingGroupFacade(true);
		setShowGroupFacadeModal(true);
	};

	const handleEditFacade = async (facade) => {
		setEditingFacadeGroupId(facade.group_facade_id);
		setIsCreatingFacade(false);
		setEditingFacadeId(facade.id);
		setShowFacadeModal(true);
	};

	const handleCreateFacade = async (groupFacadeId) => {
		setEditingFacadeGroupId(groupFacadeId);
		setIsCreatingFacade(true);
		setEditingFacadeId(null);
		setShowFacadeModal(true);
	};

	const handleHideGroupFacadeModal = () => {
		setEditingFacadeGroupId(null);
		setIsCreatingGroupFacade(null);
		setShowGroupFacadeModal(false);
	};

	const handleHideFacadeModal = () => {
		setEditingFacadeId(null);
		setIsCreatingFacade(null);
		setShowFacadeModal(false);
	};

	const handleDeleteGroupFacade = async (projectId, groupFacadeId) => {
		handleHideGroupFacadeModal();
		await dispatch(deleteGroupFacade({ projectId, id: groupFacadeId })).unwrap();
	};

	const handleDeleteFacade = async (projectId, facadeId) => {
		handleHideFacadeModal();
		await dispatch(deleteFacade({ projectId, id: facadeId })).unwrap();
	};

	return (
		<FacadeProjectModalsContext.Provider
			value={{
				handleEditGroupFacade,
				handleCreateGroupFacade,
				handleEditFacade,
				handleCreateFacade,
				handleDeleteGroupFacade,
				handleDeleteFacade,
				setShowGroupFacadeModal,
				setShowFacadeModal,
				setEditingFacadeGroupId,
				setEditingFacadeId,
				setIsCreatingGroupFacade,
				setIsCreatingFacade,
				showGroupFacadeModal,
				showFacadeModal,
				editingFacadeGroupId,
				editingFacadeId,
				isCreatingGroupFacade,
				isCreatingFacade,
				handleHideGroupFacadeModal,
				handleHideFacadeModal
			}}>
			{children}
			<FacadeGroupModal show={showGroupFacadeModal} onHide={handleHideGroupFacadeModal} groupFacadeId={editingFacadeGroupId} isCreating={isCreatingGroupFacade} />
			<FacadeModal show={showFacadeModal} onHide={handleHideFacadeModal} facadeId={editingFacadeId} groupFacadeIdProp={editingFacadeGroupId} isCreating={isCreatingFacade} />
		</FacadeProjectModalsContext.Provider>
	);
};

export const useFacadeProjectModals = () => useContext(FacadeProjectModalsContext);
