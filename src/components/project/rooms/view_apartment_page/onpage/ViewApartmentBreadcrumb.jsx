import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchProjectById } from '@slices/projects/projectsSlice';
import { fetchStaircaseById } from '@slices/rooms/staircasesSlice';
import { fetchApartmentById } from '@slices/rooms/apartmentsSlice';

const ViewApartmentBreadcrumb = ({ projectId, staircaseId, apartmentId }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const project = useSelector((state) => state.projects.byId[projectId]);
	const staircase = useSelector((state) => state.staircases.byId[staircaseId]);
	const apartment = useSelector((state) => state.apartments.byId[apartmentId]);

	useEffect(() => {
		if (!project) {
			dispatch(fetchProjectById(projectId));
		}
		if (!staircase) {
			dispatch(fetchStaircaseById({ projectId, staircaseId }));
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
			<Breadcrumb.Item active>{staircase ? staircase.title : 'Загрузка...'}</Breadcrumb.Item>
			<Breadcrumb.Item active onClick={handleApartmentClick}>
				{apartment ? apartment.number : 'Загрузка...'}
			</Breadcrumb.Item>
		</Breadcrumb>
	);
};

export default ViewApartmentBreadcrumb;
