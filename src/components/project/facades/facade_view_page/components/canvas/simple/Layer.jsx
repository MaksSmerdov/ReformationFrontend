import React, { useEffect, useState } from 'react';
import { Layer as KonvaLayer } from 'react-konva';
import Group from '@components/project/facades/facade_view_page/components/canvas/simple/Group';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';

const Layer = ({ group }) => {
	const { isGroupHidden } = useFacadeViewPage();
	const [isHidden, setIsHidden] = useState(isGroupHidden(group.id));

	useEffect(() => {
		setIsHidden(isGroupHidden(group.id));
	}, [isGroupHidden, group.id]);

	if (isHidden) {
		return null;
	}

	return (
		<KonvaLayer>
			{group.children.map((childGroup) => (
				<Group key={childGroup.id} group={childGroup}/>
			))}
		</KonvaLayer>
	);
};

export default Layer;
