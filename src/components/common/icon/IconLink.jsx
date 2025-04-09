import React, { forwardRef } from 'react';

const IconLink = forwardRef(({ icon: Icon, href, variant = 'primary', className = '', target = '_self', rel = 'noopener noreferrer' }, ref) => {
	return (
		<a ref={ref} href={href} target={target} rel={rel} className={`btn btn-${variant} border-1 rounded-2 p-2px d-flex align-items-center justify-content-center ${className}`}>
			<Icon className="w-100 h-100 p-0" />
		</a>
	);
});

export default IconLink;
