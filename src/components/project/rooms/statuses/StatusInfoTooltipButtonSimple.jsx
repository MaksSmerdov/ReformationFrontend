import { useRef } from 'react';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import StatusIcon from '@components/project/rooms/statuses/StatusIcon';
import StatusIconById from '@components/project/rooms/statuses/StatusIconById';
import { useSelector } from 'react-redux';

const StatusInfoTooltipButton = ({ statusId }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.work_statuses.status' });
	const statusTooltipTarget = useRef(null);
	const status = useSelector((state) => state.statuses.byId[statusId]);

	const handleStatusTooltipClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	return (
		<div className="h-100 d-flex" onClick={handleStatusTooltipClick}>
			<StatusIconById id={status.id} className="wh-min-resize-button cursor-pointer" />
		</div>
	);
};

export default StatusInfoTooltipButton;
