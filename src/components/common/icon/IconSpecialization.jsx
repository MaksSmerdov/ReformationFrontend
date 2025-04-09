import React, { useState, useEffect } from 'react';
import specializationIconsMap from '@assets/specializationIconsMap.json';

const IconSpecialization = ({ id, title = "" }) => {
	const [iconSrc, setIconSrc] = useState('');

	useEffect(() => {
		if (specializationIconsMap[id]) {
			setIconSrc(`/images/roles/${specializationIconsMap[id]}`);
		} else {
			setIconSrc(`/images/roles/${specializationIconsMap[1]}`);
		}
	}, [id]);

	return <img src={iconSrc} title={title} className="bg-white" />;
};

export default IconSpecialization;
