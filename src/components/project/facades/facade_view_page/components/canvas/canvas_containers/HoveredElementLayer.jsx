import React from 'react';
import { Group as KonvaGroup, Layer } from 'react-konva';
import { useFacadeViewCanvas } from '@contexts/facades_view/FacadeViewCanvasContext';
import ElementMarkers from '../simple/ElementMarkers';
import ElementTooltip from '@components/project/facades/facade_view_page/components/canvas/simple/ElementTooltip';
import SelectionBox from '../simple/SelectionBox';

const HoveredElementLayer = () => {
	const { transformedElements, hoveredElementId, tooltipPosition, setHoveredElementId } = useFacadeViewCanvas();
	const hoveredElement = transformedElements.find((el) => el.id === hoveredElementId);

	const handleMouseEnter = () => {
		setHoveredElementId(hoveredElementId);
	};

	const handleMouseLeave = () => {
		setHoveredElementId(null);
	};

	return (
		<KonvaGroup>
			{hoveredElement && (
				<>
					<ElementMarkers element={hoveredElement} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
					<ElementTooltip tooltipPosition={tooltipPosition} hoveredElement={hoveredElement} />
				</>
			)}

			<SelectionBox />
		</KonvaGroup>
	);
};

export default HoveredElementLayer;
