import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchProjectById } from '@slices/projects/projectsSlice';
import { fetchApartmentById } from '@slices/rooms/apartmentsSlice';

const ViewWallBreadcrumb = ({ projectId, staircaseId, apartmentId, roomId, wallId }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const project = useSelector((state) => state.projects.byId[projectId]);
	const apartment = useSelector((state) => state.apartments.byId[apartmentId]);

	useEffect(() => {
		if (!project) {
			dispatch(fetchProjectById(projectId));
		}
		if (!apartment) {
			dispatch(fetchApartmentById({ staircaseId, apartmentId }));
		}
	}, [dispatch, projectId, staircaseId, apartmentId, project, apartment]);

	const handleProjectClick = () => {
		navigate(`/project/${projectId}`);
	};

	const handleApartmentClick = () => {
		navigate(`/project/${projectId}/staircase/${staircaseId}/apartment/${apartmentId}`);
	};

	return (
		<Breadcrumb listProps={{ className: 'mb-0' }}>
			<Breadcrumb.Item onClick={handleProjectClick}>{project ? project.title : 'Загрузка...'}</Breadcrumb.Item>
			<Breadcrumb.Item onClick={handleApartmentClick}>{apartment ? apartment.title : 'Загрузка...'}</Breadcrumb.Item>
			<Breadcrumb.Item active>Стена {wallId}</Breadcrumb.Item>
		</Breadcrumb>
	);
};

export default ViewWallBreadcrumb;
