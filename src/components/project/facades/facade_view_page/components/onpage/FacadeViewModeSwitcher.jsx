import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';
import { useTranslation } from 'react-i18next';

const FacadeViewModeSwitcher = () => {
	const { viewMode, setViewMode } = useFacadeViewPage();
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facade_view_page.page_mode' });

	const handleModeChange = (newMode) => {
		setViewMode(newMode);
	};

	return (
		<div className="d-flex justify-content-center align-items-center gap-2">
			<span>{t('mode')}:</span>
			<ButtonGroup>
				<Button variant={viewMode === 'view' ? 'primary' : 'outline-primary'} onClick={() => handleModeChange('view')} className="">
					{t('viewing')}
				</Button>
				<Button variant={viewMode === 'edit' ? 'primary' : 'outline-primary'} onClick={() => handleModeChange('edit')} className="">
					{t('editing')}
				</Button>
			</ButtonGroup>
		</div>
	);
};

export default FacadeViewModeSwitcher;
