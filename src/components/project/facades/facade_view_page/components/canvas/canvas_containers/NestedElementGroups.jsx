import React from 'react';
import Group from '@components/project/facades/facade_view_page/components/canvas/simple/Group';

const NestedElementGroups = ({ groups }) => {
	return (
		<>
			{groups.map((group) => (
				<Group key={group.id} group={group} />
			))}
		</>
	);
};

export default NestedElementGroups;
