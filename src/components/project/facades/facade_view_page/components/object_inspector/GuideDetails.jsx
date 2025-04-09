import React from 'react';
import { useSelector } from 'react-redux';
import { selectGuideById } from '@slices/facades/guidesSlice';

const GuideDetails = ({ id }) => {
	const guide = useSelector((state) => selectGuideById(state, id));

	if (!guide) {
		return <div>Guide not found</div>;
	}

	return (
		<div>
			<h4>Guide</h4>
			<div>ID: {guide.id}</div>
			<div>Title: {guide.title}</div>
			<div>Direction: {guide.direction}</div>
			<div>Coordinate: {guide.coordinate}</div>
			<div>Size: {guide.size}</div>
		</div>
	);
};

export default GuideDetails;
