import React, { useState } from 'react';
import { Rect, Text, Circle } from 'react-konva';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';
import { useFacadeViewCanvas } from '@contexts/facades_view/FacadeViewCanvasContext';
import ElementStatus from './ElementStatus';

const Element = ({ element }) => {
	const { isElementSelected } = useFacadeViewPage();
	const [isHovered, setIsHovered] = useState(false);
	const { hoveredElementId, setHoveredElementId, setTooltipPosition, SELECTION_BORDER_WIDTH, SELECTION_BORDER_WIDTH_HALF, handleSelectionStart } = useFacadeViewCanvas();

	const isThisElementSelected = isElementSelected(element.id);

	const handleMouseEnter = (e) => {
		const stage = e.target.getStage();
		const pointerPosition = stage.getPointerPosition();
		setTooltipPosition({ x: pointerPosition.x, y: pointerPosition.y });
		setHoveredElementId(element.id);
		setIsHovered(true);
	};

	const handleMouseMove = (e) => {
		const stage = e.target.getStage();
		const pointerPosition = stage.getPointerPosition();
		setTooltipPosition({ x: pointerPosition.x, y: pointerPosition.y });
	};

	const handleMouseLeave = () => {
		setHoveredElementId(null);
		setIsHovered(false);
	};

	const handleMouseDown = (e) => {
		handleSelectionStart(e);
	};

	return (
		<>
			<Rect x={element.drawAreaRect.x} y={element.drawAreaRect.y} width={element.drawAreaRect.width} height={element.drawAreaRect.height} {...element.style} stroke="black" strokeWidth={1} onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onMouseDown={handleMouseDown} />
			<ElementStatus element={element} />
			<Rect x={element.drawAreaInsideRect.x + SELECTION_BORDER_WIDTH_HALF} y={element.drawAreaInsideRect.y + SELECTION_BORDER_WIDTH_HALF} width={element.drawAreaInsideRect.width - SELECTION_BORDER_WIDTH} height={element.drawAreaInsideRect.height - SELECTION_BORDER_WIDTH} fill="transparent" stroke={isHovered ? 'DodgerBlue' : isThisElementSelected ? 'LimeGreen' : ''} strokeWidth={SELECTION_BORDER_WIDTH} listening={false} />
			<Text x={element.drawAreaText.x + 1.5} y={element.drawAreaText.y + 2} width={element.drawAreaText.width - 3} height={element.drawAreaText.height - 4} text={element.title} fontSize={9} fill="black" fontFamily="sans-serif" fontStyle="bold" align="left" stroke="white" strokeWidth={1.5} fillAfterStrokeEnabled={true} listening={false} />
			{element.hasOrders && (
				<>
					<Circle x={element.drawAreaRect.x + element.drawAreaRect.width - 10} y={element.drawAreaRect.y + 11} radius={5} fill="orange" stroke="white" strokeWidth={1} />
					<Text x={element.drawAreaRect.x + element.drawAreaRect.width - 12.8} y={element.drawAreaRect.y + 8} text="M" fontSize={7} fill="#ffefd1" fontFamily="sans-serif" align="center" verticalAlign="middle" />
				</>
			)}
		</>
	);
};

export default Element;
