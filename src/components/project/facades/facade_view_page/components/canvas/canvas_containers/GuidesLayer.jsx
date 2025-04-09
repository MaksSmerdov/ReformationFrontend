import React from 'react';
import { Layer } from 'react-konva';
import VerticalGuide from '@components/project/facades/facade_view_page/components/canvas/simple/VerticalGuide';
import HorizontalGuide from '@components/project/facades/facade_view_page/components/canvas/simple/HorizontalGuide';

const GuidesLayer = ({ guides }) => {
	return (
		<>
			{guides.map((guide) => (
				<React.Fragment key={guide.id}>{guide.direction === 'vertical' ? <VerticalGuide guide={guide} /> : <HorizontalGuide guide={guide} />}</React.Fragment>
			))}
		</>
	);
};

export default GuidesLayer;
