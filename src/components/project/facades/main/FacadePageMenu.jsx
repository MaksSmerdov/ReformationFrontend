import React from 'react';
import FacadePageModeSwitcher from '@components/project/facades/common/FacadePageModeSwitcher';

const FacadePageMenu = () => {
	return (
		<div className="d-flex justify-content-between align-items-center p-2 border-bottom">
			<FacadePageModeSwitcher />
		</div>
	);
};

export default FacadePageMenu;
