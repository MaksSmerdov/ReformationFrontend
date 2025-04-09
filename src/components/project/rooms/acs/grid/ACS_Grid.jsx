import React, { useEffect, useState, startTransition } from 'react';
import { useSelector } from 'react-redux';
import ACS_ApartmentCell from '@components/project/rooms/acs/cell/ACS_ApartmentCell';
import ACS_StaircaseSelectAllCell from '@components/project/rooms/acs/grid/ACS_StaircaseSelectAllCell';
import ACS_StaircaseFloorsContainer from '@components/project/rooms/acs/grid/ACS_StaircaseFloorsContainer';
import ACS_StaircaseLayoutsContainer from '@components/project/rooms/acs/grid/ACS_StaircaseLayoutsContainer';
import { useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import { DrawGridProvider } from '@contexts/rooms_project/cell_system/DrawGridContext';
import ErrorBoundary from '@components/common/ErrorBoundary';

const ACS_Grid = ({ staircaseId }) => {
	const layouts = useSelector((state) => state.currentProject.staircaseLayouts.byStaircaseId[staircaseId]);
	const apartments = useSelector((state) => state.currentProject.apartments.byStaircaseId[staircaseId]);

	const { selectedApartments, handleApartmentSelect, handleMultipleApartmentSelect } = useRoomsProject();

	const [maxX, setMaxX] = useState(0);
	const [maxY, setMaxY] = useState(0);

	useEffect(() => {
		const { maxX: newMaxX, maxY: newMaxY } = apartments.reduce(
			(acc, apartment) => ({
				maxX: apartment.x_coordinate > acc.maxX ? apartment.x_coordinate : acc.maxX,
				maxY: apartment.y_coordinate > acc.maxY ? apartment.y_coordinate : acc.maxY
			}),
			{ maxX: 0, maxY: 0 }
		);
		setMaxX(newMaxX);
		setMaxY(newMaxY);
	}, [apartments]);

	const floors = Array.from({ length: maxY }, (_, i) => i + 1);

	const handleSelectRow = (row) => {
		startTransition(() => {
			const apartmentsInRow = apartments.filter((apartment) => apartment.y_coordinate === row);
			const allSelected = apartmentsInRow.every((apartment) => selectedApartments.includes(apartment.id));
			handleMultipleApartmentSelect(
				apartmentsInRow.map((apartment) => apartment.id),
				!allSelected
			);
		});
	};

	const handleSelectColumn = (column) => {
		startTransition(() => {
			const apartmentsInColumn = apartments.filter((apartment) => apartment.x_coordinate === column);
			const allSelected = apartmentsInColumn.every((apartment) => selectedApartments.includes(apartment.id));
			handleMultipleApartmentSelect(
				apartmentsInColumn.map((apartment) => apartment.id),
				!allSelected
			);
		});
	};

	const handleSelectAll = () => {
		startTransition(() => {
			const allSelected = apartments.every((apartment) => selectedApartments.includes(apartment.id));
			handleMultipleApartmentSelect(
				apartments.map((apartment) => apartment.id),
				!allSelected
			);
		});
	};

	const isAllSelected = apartments.length > 0 && apartments.every((apartment) => selectedApartments.includes(apartment.id));

	return (
		<DrawGridProvider maxX={maxX} maxY={maxY}>
			<div
				className="d-grid gap-1px me-0 mb-0"
				style={{
					gridTemplateColumns: `auto repeat(${maxX}, 1fr)`,
					gridTemplateRows: `auto repeat(${maxY}, 1fr)`
				}}>
				<ACS_StaircaseSelectAllCell isAllSelected={isAllSelected} handleSelectAll={handleSelectAll} />
				<ACS_StaircaseLayoutsContainer staircaseLayoutObjects={layouts} handleSelectColumn={handleSelectColumn} />
				<ACS_StaircaseFloorsContainer floors={floors} handleSelectRow={handleSelectRow} />
				{apartments.map((apartment) => (
					<ErrorBoundary key={apartment.id}>
						<ACS_ApartmentCell key={apartment.id} apartmentId={apartment.id} />
					</ErrorBoundary>
				))}
			</div>
		</DrawGridProvider>
	);
};

export default ACS_Grid;
