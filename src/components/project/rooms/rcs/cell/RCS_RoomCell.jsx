import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { Pencil } from 'react-bootstrap-icons';
import RCS_TicketsTopContainer from '@components/project/rooms/rcs/cell/RCS_TicketsTopContainer';
import RCS_TicketsBottomContainer from '@components/project/rooms/rcs/cell/RCS_TicketsBottomContainer';
import IconButton from '@components/common/icon/IconButton';
import { useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import { RoomCellProvider } from '@contexts/rooms_project/cell_system/RoomCellContext';
import { useDrawGrid } from '@contexts/rooms_project/cell_system/DrawGridContext';
import { useRoomProjectModals } from '@contexts/rooms_project/RoomProjectModalsContext';

const RCS_RoomCell = ({ roomId }) => {
	const { maxX, maxY } = useDrawGrid();
	const { selectedRooms, handleRoomSelect } = useRoomsProject();
	const { handleEditRoom } = useRoomProjectModals();
	const dispatch = useDispatch();

	const room = useSelector((state) => state.currentProject.rooms.byId[roomId]);
	const isSaving = useSelector((state) => state.rooms.savingRooms[roomId]);
	const apartment_mailbox_name = useSelector((state) => state.currentProject.apartments.byId[room.apartment_id].mailbox_name);
	const isSelected = selectedRooms.includes(roomId);

	const handleEditClick = useCallback(
		(e) => {
			e.stopPropagation();
			handleEditRoom(roomId);
		},
		[handleEditRoom, roomId]
	);

	return (
		<RoomCellProvider roomId={roomId}>
			<div style={{ gridColumn: 2 + maxX - room.x_coordinate, gridRow: 2 + maxY - room.y_coordinate }} onClick={() => handleRoomSelect(room.id, !isSelected)}>
				<div className="component d-flex justify-content-center align-items-center flex-column position-relative cell-outline my-grid-cell">
					<div className={`btn-outline-cell-select-on w-100 h-100 position-absolute border pe-none z-index-45 ${isSelected ? 'border-5' : 'border-0'}`}></div>
					<div className="w-100 h-100 p-0 d-grid z-index-50" style={{ gridTemplateColumns: '100%', gridTemplateRows: 'auto 1fr auto' }}>
						<div className="">
							<div className="p-1px d-flex justify-content-between align-items-center" style={{ gap: '1px' }}>
								<RCS_TicketsTopContainer />
							</div>
						</div>
						<div className="p-0 h-100 w-100 d-flex flex-row border-top border-bottom">
							<div className="h-100 d-flex flex-column border-end">
								<h5 className="m-0 p-0 d-flex invisible">!!</h5>
							</div>
							<div className="h-100 w-fill-available ps-2px pe-1px text-truncate lh-sm d-flex flex-column justify-content-center align-items-start gap-1px" style={{ fontSize: '0.7rem' }}>
								<div className="d-flex w-100 justify-content-between flex-row my--2px">
									<div className="p-0 mw-100 d-block text-truncate fw-bold">{room.title}</div>
									{/* <div>R</div> */}
								</div>
								<div className="d-flex w-100 flex-row my--2px">
									<div className="p-0 mw-100 d-block text-truncate">{apartment_mailbox_name}</div>
								</div>
							</div>
						</div>
						<div className="p-1px d-flex justify-content-between align-items-center" style={{ gap: '2px' }}>
							<RCS_TicketsBottomContainer />
						</div>
					</div>
					<div className="m-0 position-absolute d-flex justify-content-center align-items-center top-0 bottom-0 start-0 end-0 pe-none z-index-55">
						{isSaving && (
							<div className="position-absolute end-0 m-1px pe-none">
								<Spinner animation="border" className="wh-resize-button" />
							</div>
						)}
						<IconButton icon={Pencil} variant="outline-primary" onClick={handleEditClick} className="position-absolute top-0 end-0 m-1px rounded-1 show-on-hover-1 pe-auto wh-resize-button" />
					</div>
				</div>
			</div>
		</RoomCellProvider>
	);
};

export default React.memo(RCS_RoomCell);
