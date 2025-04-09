import React, { useState } from 'react';
import VerticalSwitch from '@components/common/switcher/VerticalSwitch';
import TestSwitcher from '@components/common/switcher/TestSwitcher';

const LurPage = () => {
	const [isChecked, setIsChecked] = useState(false);

	const handleSwitchChange = (event) => {
		setIsChecked(event.target.checked);
	};

	return (
		<div>
			{/* <TestSwitcher /> */}
			<div style={{ padding: '60px' }}>
				<VerticalSwitch checked={isChecked} onChange={handleSwitchChange} />
			</div>
		</div>
	);
};

export default LurPage;
