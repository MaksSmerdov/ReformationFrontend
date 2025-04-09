import React, { useEffect, useState, startTransition } from 'react';
import { useSelector } from 'react-redux';
import RCS_ApartmentContainer from '@components/project/rooms/rcs/grid/RCS_ApartmentContainer';
import RCS_StaircaseSelectAllCell from '@components/project/rooms/rcs/grid/RCS_StaircaseSelectAllCell';
import RCS_StaircaseFloorsContainer from '@components/project/rooms/rcs/grid/RCS_StaircaseFloorsContainer';
import RCS_StaircaseLayoutsContainer from '@components/project/rooms/rcs/grid/RCS_StaircaseLayoutsContainer';
import { useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import { DrawGridProvider } from '@contexts/rooms_project/cell_system/DrawGridContext';

const RCS_Grid = ({ staircaseId }) => {
	const layouts = useSelector((state) => state.currentProject.staircaseLayouts.byStaircaseId[staircaseId]);
	const apartments = useSelector((state) => state.currentProject.apartments.byStaircaseId[staircaseId]);
	const rooms = useSelector((state) => state.currentProject.rooms.byStaircaseId[staircaseId]);

	const { selectedRooms, handleRoomSelect } = useRoomsProject();

	const [maxX, setMaxX] = useState(0);
	const [maxY, setMaxY] = useState(0);

	useEffect(() => {
		const { maxX: newMaxX, maxY: newMaxY } = rooms.reduce(
			(acc, room) => ({
				maxX: room.x_coordinate > acc.maxX ? room.x_coordinate : acc.maxX,
				maxY: room.y_coordinate > acc.maxY ? room.y_coordinate : acc.maxY
			}),
			{ maxX: 0, maxY: 0 }
		);
		setMaxX(newMaxX);
		setMaxY(newMaxY);
	}, [rooms]);

	const floors = Array.from({ length: maxY }, (_, i) => i + 1);

	const handleSelectRow = (row) => {
		startTransition(() => {
			const roomsInRow = rooms.filter((room) => room.y_coordinate === row);
			const allSelected = roomsInRow.every((room) => selectedRooms.includes(room.id));
			roomsInRow.forEach((room) => {
				if (!selectedRooms.includes(room.id)) {
					handleRoomSelect(room.id, !allSelected);
				}
			});
		});
	};

	const handleSelectColumn = (column) => {
		startTransition(() => {
			const roomsInColumn = rooms.filter((room) => room.x_coordinate === column);
			const allSelected = roomsInColumn.every((room) => selectedRooms.includes(room.id));
			roomsInColumn.forEach((room) => {
				if (!selectedRooms.includes(room.id)) {
					handleRoomSelect(room.id, !allSelected);
				}
			});
		});
	};

	const handleSelectAll = () => {
		startTransition(() => {
			const allSelected = rooms.every((room) => selectedRooms.includes(room.id));
			rooms.forEach((room) => {
				if (!selectedRooms.includes(room.id)) {
					handleRoomSelect(room.id, !allSelected);
				}
			});
		});
	};

	const isAllSelected = rooms.length > 0 && rooms.every((room) => selectedRooms.includes(room.id));

	return (
		<DrawGridProvider maxX={maxX} maxY={maxY}>
			<div
				className="d-grid gap-1px me-0 mb-0"
				style={{
					gridTemplateColumns: `auto repeat(${maxX}, 1fr)`,
					gridTemplateRows: `auto repeat(${maxY}, 1fr)`
				}}>
				<RCS_StaircaseSelectAllCell isAllSelected={isAllSelected} handleSelectAll={handleSelectAll} />
				<RCS_StaircaseLayoutsContainer staircaseLayoutObjects={layouts} handleSelectColumn={handleSelectColumn} />
				<RCS_StaircaseFloorsContainer floors={floors} handleSelectRow={handleSelectRow} />
				{apartments.map((apartment) => (
					<RCS_ApartmentContainer key={apartment.id} apartmentId={apartment.id} />
				))}
			</div>
		</DrawGridProvider>
	);
};

export default RCS_Grid;
