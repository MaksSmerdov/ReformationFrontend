import React from 'react';

const VerticalSwitch = ({ checked, onChange, ...props }) => {
	return (
		<div className="p-0 form-switch" style={{ width: '14px', height: '30px' }}>
			<input
				type="checkbox"
				className="m-0 form-check-input"
				style={{
					width: '30px',
					transform: 'rotate(90deg) translate(0, -14px)',
					transformOrigin: '0px 0px'
				}}
				checked={checked}
				onChange={onChange}
				{...props}
			/>
		</div>
	);
};

export default VerticalSwitch;
