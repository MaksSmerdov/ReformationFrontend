import React, { useState } from 'react';
import { Rect, Text, Line } from 'react-konva';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';
import { useFacadeViewCanvas } from '@contexts/facades_view/FacadeViewCanvasContext';

const HorizontalGuide = ({ guide }) => {
	const { isGuideSelected, isUnrealGuideSelected, toggleGuideSelection, toggleUnrealGuideSelection } = useFacadeViewPage();
	const { SELECTION_BORDER_WIDTH, SELECTION_BORDER_WIDTH_HALF } = useFacadeViewCanvas();

	const isUnrealGuide = guide.id.startsWith('generated-guide-');

	const [isHovered, setIsHovered] = useState(false);

	const isThisGuideSelected = isUnrealGuide ? isUnrealGuideSelected(guide.id) : isGuideSelected(guide.id);

	const handleGuideClick = (e) => {
		if (isUnrealGuide) {
			toggleUnrealGuideSelection(guide, !isThisGuideSelected, e.evt.button === 2);
		} else {
			toggleGuideSelection(guide.id, !isThisGuideSelected, e.evt.button === 2);
		}
	};

	const handleMouseEnter = (e) => {
		setIsHovered(true);
		e.cancelBubble = true;
	};

	const handleMouseLeave = (e) => {
		setIsHovered(false);
		e.cancelBubble = true;
	};

	return (
		<>
			<Line points={guide.linePoints} stroke="orange" strokeWidth={2} />
			<Rect x={guide.drawCoords.x} y={guide.drawCoords.y} width={guide.drawCoords.width} height={guide.drawCoords.height} fill="DimGray" onClick={handleGuideClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
			<Rect x={guide.drawCoords.x + SELECTION_BORDER_WIDTH_HALF} y={guide.drawCoords.y + SELECTION_BORDER_WIDTH_HALF} width={guide.drawCoords.width - SELECTION_BORDER_WIDTH} height={guide.drawCoords.height - SELECTION_BORDER_WIDTH} fill="transparent" stroke={isHovered ? 'DodgerBlue' : isThisGuideSelected ? 'LimeGreen' : ''} strokeWidth={SELECTION_BORDER_WIDTH} listening={false} />
			<Text x={guide.drawCoords.x} y={guide.drawCoords.y} width={guide.drawCoords.width} height={guide.drawCoords.height} text={guide.title} fontSize={guide.fontSize} align="center" verticalAlign="middle" fill="orange" fontFamily="sans-serif" fontStyle="bold" wrap="none" listening={false} />
		</>
	);
};

export default HorizontalGuide;
