import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'react-bootstrap-icons';

const PSM_StatusTypeSelector = ({ statusType, setStatusType }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.psm' });

	const handleStatusTypeClick = (type) => {
		setStatusType((prevType) => (prevType === type ? null : type));
	};

	const statusTypes = [
		{ id: 'type1', color: 'white', bgColor: 'c-status-future-color', text: t('status_assignment_controls.plan_work') },
		{ id: 'type3', color: 'white', bgColor: 'c-status-future-raport-color', text: t('status_assignment_controls.send_to_workers') },
		{ id: 'type4', color: 'white', bgColor: 'c-status-future-raport-color', text: t('status_assignment_controls.inform_client') },
		{ id: 'type2', color: '#002C41', bgColor: 'c-status-past-color', text: t('status_assignment_controls.mark_work') },
		{ id: 'type5', color: '#002C41', bgColor: 'c-status-past-raport-color', text: t('status_assignment_controls.by_teams') },
		{ id: 'type6', color: '#002C41', bgColor: 'c-status-past-raport-color', text: t('status_assignment_controls.send_to_client') }
	];

	return (
		<div className="d-flex flex-column gap-1px">
			{statusTypes.map(({ id, color, bgColor, text }) => (
				<div key={id} className={`w-100 p-0 gap-2 rounded-0 border-0 c-status-button ${bgColor} text-${color === 'white' ? 'white' : 'black'} d-grid align-items-center cursor-pointer ${statusType === id ? 'active' : ''}`} style={{ gridTemplateColumns: 'auto 1fr auto', gridTemplateRows: 'auto' }} onClick={() => handleStatusTypeClick(id)}>
					<Form.Check name="statusType" id={id} className="ps-2 d-flex align-items-center" onChange={() => handleStatusTypeClick(id)}>
						<Form.Check.Input className="m-0" type="radio" checked={statusType === id} onChange={() => handleStatusTypeClick(id)} />
					</Form.Check>
					<div style={{ color, fontWeight: statusType === id ? 'bold' : 'normal' }} className="text-start text-nowrap">
						{text}
					</div>
					<ChevronRight className="wh-resize-button border-start" />
				</div>
			))}
		</div>
	);
};

export default PSM_StatusTypeSelector;
