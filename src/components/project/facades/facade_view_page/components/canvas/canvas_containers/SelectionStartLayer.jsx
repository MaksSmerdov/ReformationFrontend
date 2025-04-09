import React from 'react';
import { Layer, Rect } from 'react-konva';
import { useFacadeViewCanvas } from '@contexts/facades_view/FacadeViewCanvasContext';

const SelectionStartLayer = () => {
	const { stageWidth, stageHeight, handleSelectionStart } = useFacadeViewCanvas();

	return <Rect x={0} y={0} width={stageWidth} height={stageHeight} fill="transparent" onMouseDown={handleSelectionStart} />;
};

export default SelectionStartLayer;
