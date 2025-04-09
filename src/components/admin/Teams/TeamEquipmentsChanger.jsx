import React, { useCallback } from 'react';
import SelectEquipment from '@components/common/select/SelectEquipment';
import IconButton from '@components/common/icon/IconButton';
import { PlusLg, Trash } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import IconEvent from '@components/common/icon/IconEvent';
import { Card } from 'react-bootstrap';

const TeamEquipmentsChanger = ({ equipments, setEquipments, className }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });

	const handleEquipmentChange = useCallback(
		(index, selectedEquipmentId) => {
			const updatedEquipments = [...equipments];
			updatedEquipments[index].equipment.id = selectedEquipmentId;
			setEquipments(updatedEquipments);
		},
		[equipments, setEquipments]
	);

	const handleAddRow = useCallback(() => {
		setEquipments([...equipments, { equipment: { id: null } }]);
	}, [equipments, setEquipments]);

	const handleRemoveRow = useCallback(
		(index) => {
			const updatedEquipments = [...equipments];
			updatedEquipments.splice(index, 1);
			setEquipments(updatedEquipments);
		},
		[equipments, setEquipments]
	);

	return (
		<Card className={className}>
			<Card.Body className="p-0 overflow-hidden">
				<div className="p-2px d-grid gap-2px align-items-center overflow-auto" style={{ gridTemplateColumns: 'min-content 1fr min-content', maxHeight: '300px' }}>
					{equipments.map((equipment, index) => (
						<React.Fragment key={index}>
							<IconEvent className="wh-resize-button" isValid={equipment.equipment.id} />
							<SelectEquipment className="w-100" value={equipment.equipment.id} onChange={(selectedEquipmentId) => handleEquipmentChange(index, selectedEquipmentId)} />
							<IconButton className="wh-resize-button" icon={Trash} variant="danger" onClick={() => handleRemoveRow(index)} />
						</React.Fragment>
					))}
					<div className="d-flex justify-content-center" style={{ gridColumn: 'span 3' }}>
						<IconButton className="w-100 h-resize-button" icon={PlusLg} variant="success" onClick={handleAddRow} />
					</div>
				</div>
			</Card.Body>
		</Card>
	);
};

export default React.memo(TeamEquipmentsChanger);
