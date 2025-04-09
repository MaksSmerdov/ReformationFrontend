import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import { useFacadesProject } from '@contexts/facades_project/FacadesProjectContext';
import { useTranslation } from 'react-i18next';

const FacadePageModeSwitcher = () => {
	const { mode, setMode } = useFacadesProject();
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.page_mode' });

	const handleModeChange = (newMode) => {
		setMode(newMode);
	};

	return (
		<div className="d-flex justify-content-center align-items-center gap-2">
			<span>{t('mode')}:</span>
			<ButtonGroup>
				<Button variant={mode === 'view' ? 'primary' : 'outline-primary'} onClick={() => handleModeChange('view')} className="">
					{t('viewing')}
				</Button>
				<Button variant={mode === 'edit' ? 'primary' : 'outline-primary'} onClick={() => handleModeChange('edit')} className="">
					{t('editing')}
				</Button>
			</ButtonGroup>
		</div>
	);
};

export default FacadePageModeSwitcher;
