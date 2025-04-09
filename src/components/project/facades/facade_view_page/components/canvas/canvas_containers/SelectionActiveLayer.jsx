import React from 'react';
import { Layer, Rect } from 'react-konva';
import { useFacadeViewCanvas } from '@contexts/facades_view/FacadeViewCanvasContext';

const SelectionActiveLayer = () => {
	const { stageWidth, stageHeight, isSelecting, handleSelectionMove, handleSelectionEnd } = useFacadeViewCanvas();

	if (!isSelecting) return null;

	return <Rect x={0} y={0} width={stageWidth} height={stageHeight} fill="transparent" onMouseMove={handleSelectionMove} onMouseUp={handleSelectionEnd} />;
};

export default SelectionActiveLayer;
