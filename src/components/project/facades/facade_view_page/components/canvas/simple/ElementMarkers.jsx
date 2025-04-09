import React from 'react';
import { useFacadeViewCanvas } from '@contexts/facades_view/FacadeViewCanvasContext';
import { Circle, Text, Group as KonvaGroup } from 'react-konva';

const ElementMarkers = ({ onMouseEnter, onMouseMove, onMouseLeave }) => {
	const { hoveredElementId, hoveredElementMarkerClick, transformedElements } = useFacadeViewCanvas();

	if (!hoveredElementId) return null;

	const element = transformedElements.find((el) => el.id === hoveredElementId);

	const markerRadius = 8;
	const markerFill = 'green';
	const markerStroke = 'black';
	const markerStrokeWidth = 1;

	const { x, y, width, height } = element.drawAreaRect;
	const positions = [
		{
			direction: 'top',
			coords: { x: x + width / 2, y: y }
		},
		{
			direction: 'right',
			coords: { x: x + width, y: y + height / 2 }
		},
		{
			direction: 'bottom',
			coords: { x: x + width / 2, y: y + height }
		},
		{
			direction: 'left',
			coords: { x: x, y: y + height / 2 }
		}
	];

	const handleHoveredElementMarkerClick = (position) => {
		hoveredElementMarkerClick(position.direction);
	};

	return (
		<KonvaGroup onMouseEnter={onMouseEnter} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
			{positions.map((pos) => (
				<React.Fragment key={pos.direction}>
					<Circle key={`${pos.direction}-circle`} x={pos.coords.x} y={pos.coords.y} radius={markerRadius} fill={markerFill} stroke={markerStroke} strokeWidth={markerStrokeWidth} onClick={(e) => handleHoveredElementMarkerClick(pos)} />
					<Text key={`${pos.direction}-text`} x={pos.coords.x - markerRadius} y={pos.coords.y - markerRadius} width={markerRadius * 2} height={markerRadius * 2} text="+" fontSize={markerRadius * 2} fill="white" fontFamily="sans-serif" fontStyle="bold" align="center" verticalAlign="bottom" listening={false} />
				</React.Fragment>
			))}
		</KonvaGroup>
	);
};

export default ElementMarkers;
