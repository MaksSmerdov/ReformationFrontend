import { Form, InputGroup } from 'react-bootstrap';
import SelectEquipment from '@components/common/select/SelectEquipment';
import { useTranslation } from 'react-i18next';

const TicketTeamEquipmentRow = ({ ticketTeamEquipment, onTicketTeamEquipmentChange, excludedEquipmentIds }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });

  const handleIsSelectChange = (e) => {
    onTicketTeamEquipmentChange(ticketTeamEquipment.equipment.id, {
      ...ticketTeamEquipment,
      isSelected: e.target.checked,
    });
  };

  const handleHoursChange = (e) => {
    let value = parseInt(e.target.value, 10) || 0; // Добавлено || 0
    if (value > 999) value = 999;
    if (value < 0) value = 0;

    onTicketTeamEquipmentChange(ticketTeamEquipment.equipment.id, { ...ticketTeamEquipment, hours_worked: value });
  };

  const handleEquipmentChange = (equipmentId) => {
    onTicketTeamEquipmentChange(ticketTeamEquipment.equipment.id, {
      ...ticketTeamEquipment,
      equipment: { ...ticketTeamEquipment.equipment, id: equipmentId },
    });
  };

  return (
    <div className="d-flex align-items-center justify-content-between gap-2">
      <div className="d-flex flex-row align-items-center gap-2">
        <Form.Check>
          <Form.Check.Input
            className="m-0"
            type="checkbox"
            checked={ticketTeamEquipment.isSelected ?? false}
            onChange={handleIsSelectChange}
          />
        </Form.Check>
				<SelectEquipment
        value={ticketTeamEquipment.equipment.id}
        onChange={handleEquipmentChange}
        isDisabled={!ticketTeamEquipment.isEditable}
        excludedEquipmentIds={excludedEquipmentIds}
      />
      </div>

      <div className="d-flex flex-row align-items-center gap-1px">
        <div className="" style={{ width: '30px' }}>
          <InputGroup>
            <Form.Control
              type="number"
              step="1"
              min="0"
              max="999"
              size="2"
              value={ticketTeamEquipment.hours_worked || 0}
              onChange={handleHoursChange}
              placeholder={t('hours')}
              className="px-1 py-1px no-spinner"
            />
          </InputGroup>
        </div>
        h
      </div>
    </div>
  );
};

export default TicketTeamEquipmentRow;
