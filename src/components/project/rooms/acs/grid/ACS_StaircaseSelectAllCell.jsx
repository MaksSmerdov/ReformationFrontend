import { Button } from 'react-bootstrap';
import { ArrowDownRight } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';

const ACS_StaircaseSelectAllCell = ({ isAllSelected, handleSelectAll }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.grid_buttons' });

	return (
		<div style={{ gridColumn: 1, gridRow: 1 }} className="position-relative bg-body cell-outline my-grid-cell">
			<Button variant="outline-success" className="position-absolute bottom-0 end-0 p-0 d-flex justify-content-center align-items-center h-100 w-100 border-0 rounded-0" style={{ backgroundColor: isAllSelected ? '#EB1010' : '#9DFF8D', color: isAllSelected ? 'white' : 'black' }} onClick={handleSelectAll}>
				{isAllSelected ? t('deselect_all') : t('select_all')}
			</Button>
		</div>
	);
};

export default ACS_StaircaseSelectAllCell;
