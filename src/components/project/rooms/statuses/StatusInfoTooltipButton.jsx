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

	const blockingIds = status.status_logics?.map((logic) => logic.blocking_id);

	return (
		<OverlayTrigger
			trigger="click"
			placement="top"
			overlay={
				<Popover id={`status-popover-${status.id}`} ref={statusTooltipTarget} className="pe-auto px-2 py-2px">
					<Popover.Body className="p-0">
						<div className="d-flex flex-column align-items-center gap-1">
							<label className="fw-bold">{t('description')}</label>
							<label className="">{status.description ?? 'empty description'}</label>
							<label className="fw-bold">{t('previous_statuses')}</label>
							<div className="d-flex flex-wrap gap-1">{blockingIds.length > 0 ? blockingIds.map((id) => <StatusIconById key={id} id={id} className="wh-min-resize-button" />) : <label className="">empty</label>}</div>
						</div>
					</Popover.Body>
				</Popover>
			}
			rootClose={true}>
			<div className="h-100 d-flex" onClick={handleStatusTooltipClick}>
				<StatusIconById id={status.id} className="wh-min-resize-button cursor-pointer" />
			</div>
		</OverlayTrigger>
	);
};

export default StatusInfoTooltipButton;
