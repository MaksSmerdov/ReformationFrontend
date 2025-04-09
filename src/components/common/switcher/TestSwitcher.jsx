import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

const TestSwitcher = () => {
	const [selected, setSelected] = useState(['speed', 'quality']);

	const handleSwitchChange = (option) => {
		// if (option === 'price') {
		// 	return;
		// }

		if (selected.includes(option)) {
			setSelected(selected.filter((item) => item !== option));
		} else {
			if (selected.length === 2) {
				if (option === 'speed' && selected.includes('quality')) {
					setSelected(['quality', option]);
				}
				if (option === 'quality' && selected.includes('scope')) {
					setSelected(['scope', option]);
				}
				if (option === 'scope' && selected.includes('speed')) {
					setSelected(['speed', option]);
				}
			} else {
				setSelected([...selected, option]);
			}
		}
	};

	return (
		<Form>
			<Form.Label>Select project development priorities:</Form.Label>
			<Form.Check type="switch" id="speed-switch" label="Speed" checked={selected.includes('speed')} onChange={() => handleSwitchChange('speed')} />
			<Form.Check type="switch" id="quality-switch" label="Quality" checked={selected.includes('quality')} onChange={() => handleSwitchChange('quality')} />
			<Form.Check type="switch" id="scope-switch" label="Scope" checked={selected.includes('scope')} onChange={() => handleSwitchChange('scope')} />
			{/* <Form.Check type="switch" id="price-switch" label="Salary" checked={selected.includes('price')} onChange={() => handleSwitchChange('price')} /> */}
		</Form>
	);
};

export default TestSwitcher;
