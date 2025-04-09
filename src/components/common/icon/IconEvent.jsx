import React from 'react';
import { PlusLg, Trash, ExclamationCircle, ArrowRepeat, Link45deg } from 'react-bootstrap-icons';
import IconButton from '@components/common/icon/IconButton';

const IconEvent = ({ isCreating, isDeleting, isUpdated, isValid, className = '' }) => {
	let IconComponent;

	if (!isValid) {
		IconComponent = ExclamationCircle;
	} else if (isCreating) {
		IconComponent = PlusLg;
	} else if (isDeleting) {
		IconComponent = Trash;
	} else if (isUpdated) {
		IconComponent = ArrowRepeat;
	} else {
		IconComponent = Link45deg;
	}

	return <IconButton variant="outline-info" className={`pe-none ${className}`} icon={IconComponent} />;
};

export default IconEvent;
