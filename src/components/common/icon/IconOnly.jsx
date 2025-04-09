import React from 'react';

const IconOnly = ({ icon: Icon, variant = 'secondary', className = '' }) => {
	return (
		<div className={`d-flex text-${variant} ${className}`}>
			<Icon className="w-100 h-100 p-0" />
		</div>
	);
};

export default IconOnly;
