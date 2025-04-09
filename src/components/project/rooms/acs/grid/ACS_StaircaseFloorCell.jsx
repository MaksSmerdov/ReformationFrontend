import { ArrowRightCircleFill } from 'react-bootstrap-icons';
import IconButton from '@components/common/icon/IconButton';
import { useDrawGrid } from '@contexts/rooms_project/cell_system/DrawGridContext';

const ACS_StaircaseFloorCell = ({ yCoordinate, handleSelectRow }) => {
	const { maxY } = useDrawGrid();
	const invertedIndex = 1 + maxY - yCoordinate;

	return (
		<div style={{ gridColumn: 1, gridRow: yCoordinate + 1 }} className="p-0 m-0 position-relative text-center d-flex justify-content-center align-items-center bg-body fw-bold cell-outline my-grid-cell">
			<div className="h-100 w-100 d-flex justify-content-center align-items-center fs-4">{invertedIndex}</div>
			<IconButton icon={ArrowRightCircleFill} variant="outline-cell-select-on" onClick={() => handleSelectRow(invertedIndex)} className="position-absolute top-0 bottom-0 end-0 m-1px rounded-1 w-resize-button" />
		</div>
	);
};

export default ACS_StaircaseFloorCell;
