import React from 'react';
import { useSelector } from 'react-redux';
import { selectElementGroupById } from '@slices/facades/elementGroupsSlice';

const ElementGroupDetails = ({ id }) => {
	const elementGroup = useSelector((state) => selectElementGroupById(state, id));

	if (!elementGroup) {
		return <div>Element Group not found</div>;
	}

	return (
		<div>
			<h4>Element Group</h4>
			<div>ID: {elementGroup.id}</div>
			<div>Title: {elementGroup.title}</div>
			<div>Parent ID: {elementGroup.parent_id ?? "NULL"}</div>
			<div>Type: {elementGroup.type}</div>
		</div>
	);
};

export default ElementGroupDetails;
