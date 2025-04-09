import React from 'react';
import { Rect, Text } from 'react-konva';

const ElementTooltip = ({ tooltipPosition, hoveredElement }) => {
	if (!hoveredElement) return null;

	const tooltipText =
		`ID: ${hoveredElement.id}\n` + //
		`Left (X): ${hoveredElement.left}\n` + //
		`Width: ${hoveredElement.width}\n` + //
		`Right: ${hoveredElement.left + hoveredElement.width}\n` + //
		`Bottom (Y): ${hoveredElement.bottom}\n` + //
		`Height: ${hoveredElement.height}\n` + //
		`Top: ${hoveredElement.bottom + hoveredElement.height}\n` + //
		`Type: ${hoveredElement.type.title}`; //

	const tooltipOffset = { x: 12, y: 15 };
	const tooltipFontSize = 12;
	const tooltipPadding = 3;
	const tooltipHeight = tooltipFontSize * 7 + tooltipPadding * 2;
	const tooltipWidth = 120;

	const tooltipX = tooltipPosition.x + tooltipOffset.x;
	const tooltipY = tooltipPosition.y + tooltipOffset.y;

	return (
		<>
			<Rect x={tooltipX} y={tooltipY} width={tooltipWidth} height={tooltipHeight} fill="white" stroke="black" strokeWidth={1} cornerRadius={tooltipPadding} listening={false} />
			<Text x={tooltipX} y={tooltipY} width={tooltipWidth} height={tooltipHeight} text={tooltipText} fontSize={tooltipFontSize} fill="black" padding={tooltipPadding} listening={false} />
		</>
	);
};

export default ElementTooltip;
