import React from 'react';
import { Rect } from 'react-konva';
import { useFacadeViewCanvas } from '@contexts/facades_view/FacadeViewCanvasContext';

const SelectionBox = () => {
	const { selectionBox } = useFacadeViewCanvas();

	if (!selectionBox) return null;

	const { x, y, width, height } = selectionBox;

	return <Rect x={x} y={y} width={width} height={height} fill="rgba(0, 123, 255, 0.3)" stroke="blue" strokeWidth={1} />;
};

export default SelectionBox;
