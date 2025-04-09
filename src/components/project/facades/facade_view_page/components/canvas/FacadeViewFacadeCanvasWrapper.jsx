import React from 'react';
import { FacadeViewCanvasProvider } from '@contexts/facades_view/FacadeViewCanvasContext';
import FacadeViewFacadeCanvas from '@components/project/facades/facade_view_page/components/canvas/FacadeViewFacadeCanvas';

const FacadeViewFacadeCanvasWrapper = ({ guides, elementGroups, elements }) => {
	return (
		<FacadeViewCanvasProvider guides={guides} elementGroups={elementGroups} elements={elements}>
			<FacadeViewFacadeCanvas />
		</FacadeViewCanvasProvider>
	);
};

export default FacadeViewFacadeCanvasWrapper;
