import React, { forwardRef } from 'react';
import { Button } from 'react-bootstrap';

const IconButton = forwardRef(({ icon: Icon, variant = 'primary', onClick, className = '' }, ref) => {
	return (
		<Button ref={ref} variant={variant} className={`p-2px d-flex ${className}`} onClick={onClick}>
			<Icon className="w-100 h-100 p-0" />
		</Button>
	);
});

export default IconButton;
