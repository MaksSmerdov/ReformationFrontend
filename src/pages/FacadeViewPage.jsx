import React from 'react';
import { useParams } from 'react-router-dom';
import FacadeViewMainComponent from '@components/project/facades/facade_view_page/FacadeViewMainComponent';

const FacadeViewPage = () => {
	const { projectId, facadeId } = useParams();

	return <FacadeViewMainComponent projectId={projectId} facadeId={facadeId} />;
};

export default FacadeViewPage;
