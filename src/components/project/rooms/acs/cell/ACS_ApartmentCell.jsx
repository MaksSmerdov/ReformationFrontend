import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { Pencil, Eye } from 'react-bootstrap-icons';
import IconButton from '@components/common/icon/IconButton';
import IconLink from '@components/common/icon/IconLink';
import { useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import { ApartmentCellProvider } from '@contexts/rooms_project/cell_system/ApartmentCellContext';
import { useDrawGrid } from '@contexts/rooms_project/cell_system/DrawGridContext';
import ACS_TicketsTopContainer from '@components/project/rooms/acs/cell/ACS_TicketsTopContainer';
import ACS_TicketsBottomContainer from '@components/project/rooms/acs/cell/ACS_TicketsBottomContainer';
import { useRoomProjectModals } from '@contexts/rooms_project/RoomProjectModalsContext';

const ACS_ApartmentCell = ({ apartmentId }) => {
	const { projectId } = useParams();
	const { maxX, maxY } = useDrawGrid();
	const { selectedApartments, handleApartmentSelect } = useRoomsProject();
	const { handleEditApartment } = useRoomProjectModals();

	const apartment = useSelector((state) => state.currentProject.apartments.byId[apartmentId]);
	const isSaving = useSelector((state) => state.apartments.savingApartments[apartmentId]);
	const isSelected = selectedApartments.includes(apartmentId);

	const handleEditClick = useCallback(
		(e) => {
			e.stopPropagation();
			handleEditApartment(apartmentId);
		},
		[handleEditApartment, apartmentId]
	);

	const viewUrl = `/project/${projectId}/staircase/${apartment.staircase_id}/apartment/${apartmentId}`;

	return (
		<ApartmentCellProvider apartmentId={apartmentId}>
			<div style={{ gridColumn: 2 + maxX - apartment.x_coordinate, gridRow: 2 + maxY - apartment.y_coordinate }} onClick={() => handleApartmentSelect(apartment.id, !isSelected)}>
				<div className="component d-flex justify-content-center align-items-center flex-column position-relative cell-outline my-grid-cell">
					<div className={`btn-outline-cell-select-on w-100 h-100 position-absolute border pe-none z-index-45 ${isSelected ? 'border-5' : 'border-0'}`}></div>
					<div className="w-100 h-100 p-0 d-grid z-index-50" style={{ gridTemplateColumns: '100%', gridTemplateRows: 'auto 1fr auto' }}>
						<div className="">
							<div className="p-1px d-flex justify-content-between align-items-center" style={{ gap: '1px' }}>
								<ACS_TicketsTopContainer />
							</div>
						</div>
						<div className="p-0 h-100 w-100 d-flex flex-row border-top border-bottom">
							<div className="h-100 d-flex flex-column border-end">
								<h5 className="m-0 p-0 d-flex invisible">!!</h5>
							</div>
							<div className="h-100 w-fill-available ps-2px pe-1px text-truncate lh-sm d-flex flex-column justify-content-center align-items-start gap-0" style={{ fontSize: '0.7rem' }}>
								<div className="d-flex w-100 justify-content-between flex-row my--1px">
									<div className="p-0 mw-100 d-block text-truncate fw-bold">{apartment.number}</div>
								</div>
								<div className="d-flex w-100 flex-row my--1px">
									<div className="p-0 mw-100 d-block text-truncate">{apartment.mailbox_name}</div>
								</div>
							</div>
						</div>
						<div className="p-1px d-flex justify-content-between align-items-center" style={{ gap: '2px' }}>
							<ACS_TicketsBottomContainer />
						</div>
					</div>
					<div className="m-0 position-absolute d-flex justify-content-center align-items-center top-0 bottom-0 start-0 end-0 pe-none z-index-55">
						{isSaving && (
							<div className="position-absolute end-0 m-1px pe-none">
								<Spinner animation="border" className="wh-resize-button" />
							</div>
						)}
						<IconButton icon={Pencil} variant="outline-primary" onClick={handleEditClick} className="position-absolute top-0 end-0 m-1px rounded-1 show-on-hover-1 pe-auto wh-resize-button" />
						<div className="position-absolute top-50 end-0 w-0 h-0 d-flex justify-content-center align-items-end translate-middle-y">
							<IconLink icon={Eye} href={viewUrl} variant="outline-primary" className=" m-1px rounded-1 show-on-hover-1 pe-auto wh-resize-button" target="_blank" />
						</div>
					</div>
				</div>
			</div>
		</ApartmentCellProvider>
	);
};

export default React.memo(ACS_ApartmentCell);
