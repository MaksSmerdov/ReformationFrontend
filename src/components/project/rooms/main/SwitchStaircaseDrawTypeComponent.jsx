import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SwitchStaircaseDrawTypeComponent = ({ switchStaircaseDrawMode, setSwitchStaircaseDrawMode }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.main.switch_staircase_draw_type_component' });

	const handleSwitchChange = () => {
		setSwitchStaircaseDrawMode(!switchStaircaseDrawMode);
	};

	return (
		<Form className="d-flex gap-2 align-items-center">
			<Form.Label className={`m-0 ${!switchStaircaseDrawMode ? 'text-decoration-underline' : 'opacity-5'}`} onClick={() => setSwitchStaircaseDrawMode(false)}>
				{t('rooms')}
			</Form.Label>
			<Form.Check type="switch" className="d-flex p-0">
				<Form.Check.Input id="custom-switch" checked={switchStaircaseDrawMode} onChange={handleSwitchChange} className="m-0" />
			</Form.Check>
			<Form.Label className={`m-0 ${switchStaircaseDrawMode ? 'text-decoration-underline' : 'opacity-5'}`} onClick={() => setSwitchStaircaseDrawMode(true)}>
				{t('apartments')}
			</Form.Label>
		</Form>
	);
};

export default SwitchStaircaseDrawTypeComponent;
