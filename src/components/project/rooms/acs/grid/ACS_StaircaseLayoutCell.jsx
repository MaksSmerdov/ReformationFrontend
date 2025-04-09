import { ArrowDownCircleFill, Pencil } from 'react-bootstrap-icons';
import IconButton from '@components/common/icon/IconButton';
import { useDrawGrid } from '@contexts/rooms_project/cell_system/DrawGridContext';
import { useRoomProjectModals } from '@contexts/rooms_project/RoomProjectModalsContext';

const ACS_StaircaseLayoutCell = ({ xCoordinate, layoutObject, handleSelectColumn }) => {
	const { maxX } = useDrawGrid();
	const invertedIndex = 1 + maxX - xCoordinate;

	return (
		<div style={{ gridColumn: xCoordinate + 1, gridRow: 1 }} className="p-0 m-0 position-relative text-center d-flex justify-content-center align-items-center bg-body fw-bold cell-outline my-grid-cell">
			<div className="d-flex justify-content-center align-items-center fs-4">{layoutObject.title}</div>
			<IconButton icon={ArrowDownCircleFill} variant="outline-cell-select-on" onClick={() => handleSelectColumn(invertedIndex)} className="position-absolute bottom-0 start-0 end-0 m-1px h-resize-button" />
			<IconButton icon={Pencil} variant="outline-primary" onClick={() => handleEditStaircaseLayout(layoutObject.id)} className="position-absolute top-0 end-0 m-1px rounded-1 wh-resize-button" />
		</div>
	);
};

export default ACS_StaircaseLayoutCell;
