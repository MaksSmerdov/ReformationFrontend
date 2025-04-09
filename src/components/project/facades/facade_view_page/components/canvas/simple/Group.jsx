import React from 'react';
import { useDispatch } from 'react-redux';
import { Group as KonvaGroup } from 'react-konva';
import Element from '@components/project/facades/facade_view_page/components/canvas/simple/Element';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';

const Group = ({ group }) => {
	const { isGroupHidden } = useFacadeViewPage();

	const isHidden = isGroupHidden(group.id);

	if (isHidden) return null;

	return (
		<KonvaGroup>
			{group.children?.map((childGroup) => (
				<Group key={childGroup.id} group={childGroup} />
			))}
			{group.elements.map((el) => (
				<Element key={el.id} element={el} />
			))}
		</KonvaGroup>
	);
};

export default Group;
