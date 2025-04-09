import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchProjectById } from '@slices/projects/projectsSlice';

const FacadeViewBreadcrumb = ({ projectId, facadeTitle }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const project = useSelector((state) => state.projects.byId[projectId]);
	const projectStatus = useSelector((state) => state.projects.status);
	const projectError = useSelector((state) => state.projects.error);

	useEffect(() => {
		if (!project) {
			dispatch(fetchProjectById(projectId));
		}
	}, [dispatch, projectId, project]);

	const handleProjectClick = () => {
		navigate(`/project/${projectId}`);
	};

	if (projectStatus === 'loading') {
		return <div>Loading...</div>;
	}

	if (projectStatus === 'failed') {
		return <div>Error: {projectError}</div>;
	}

	if (!project) {
		return <div>Project not found</div>;
	}

	return (
		<Breadcrumb listProps={{ className: 'mb-0' }}>
			<Breadcrumb.Item onClick={handleProjectClick}>{project.title}</Breadcrumb.Item>
			<Breadcrumb.Item active>{facadeTitle}</Breadcrumb.Item>
		</Breadcrumb>
	);
};

export default FacadeViewBreadcrumb;
