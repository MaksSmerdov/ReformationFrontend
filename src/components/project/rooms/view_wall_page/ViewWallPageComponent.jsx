import React from 'react';
import { useParams } from 'react-router-dom';
import ViewWallBreadcrumb from './onpage/ViewWallBreadcrumb';

const ViewWallPageComponent = () => {
	const { projectId, staircaseId, apartmentId, roomId, wallId } = useParams();

	return (
		<div>
			<ViewWallBreadcrumb projectId={projectId} staircaseId={staircaseId} apartmentId={apartmentId} roomId={roomId} wallId={wallId} />
			<h1>View Wall Page</h1>
			<p>Project ID: {projectId}</p>
			<p>Staircase ID: {staircaseId}</p>
			<p>Apartment ID: {apartmentId}</p>
			<p>Room ID: {roomId}</p>
			<p>Wall ID: {wallId}</p>
		</div>
	);
};

export default ViewWallPageComponent;
