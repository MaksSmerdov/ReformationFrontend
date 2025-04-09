import { useMemo } from 'react';
import { calculateMaxCoordinates, transformElements, transformGuides, generateMeasurementLines, createGuidesFromMeasurementLines, buildNestedElementGroups } from '@utils/facades/facadeUtils';

const useCanvasData = ({ elements, guides, elementGroups }) => {
	const SCALE = 20;
	const PADDING = { left: 20, right: 2, top: 20, bottom: 2 };
	const GUIDE_VERTICAL_WIDTH = 30;
	const GUIDE_HORIZONTAL_WIDTH = 25;
	const GUIDE_LINE_WIDTH = 15;
	const MEASUREMENT_LINE_FONT_SIZE = 12;
	const SELECTION_BORDER_WIDTH = 5;
	const SELECTION_BORDER_WIDTH_HALF = SELECTION_BORDER_WIDTH / 2;

	const { elementsMinX, elementsMinY, elementsMaxX, elementsMaxY, facadeSizeX, facadeSizeY } = useMemo(() => calculateMaxCoordinates(elements), [elements]);

	const transformedElements = useMemo(() => transformElements(elements, elementsMinX, elementsMaxY, SCALE, PADDING), [elements, elementsMinX, elementsMaxY]);

	const nestedElementGroups = useMemo(() => buildNestedElementGroups(elementGroups, transformedElements), [elementGroups, transformedElements]);

	const { linesCount, measurementLines } = useMemo(() => generateMeasurementLines(elementsMinX, elementsMinY, elementsMaxX, elementsMaxY, elements, SCALE, PADDING, MEASUREMENT_LINE_FONT_SIZE), [elements, elementsMaxX, elementsMaxY]);

	const GUIDE_VERTICAL_PADDING = GUIDE_LINE_WIDTH + linesCount.vertical * (MEASUREMENT_LINE_FONT_SIZE + 5.5);
	const GUIDE_HORIZONTAL_PADDING = GUIDE_LINE_WIDTH + linesCount.horizontal * (MEASUREMENT_LINE_FONT_SIZE + 5.5);

	const transformedGuides = useMemo(() => {
		const generatedGuides = createGuidesFromMeasurementLines(measurementLines);
		const allGuides = [...guides, ...generatedGuides];

		return transformGuides(allGuides, elementsMinX, elementsMinY, elementsMaxX, elementsMaxY, SCALE, PADDING, GUIDE_VERTICAL_PADDING, GUIDE_HORIZONTAL_PADDING, GUIDE_VERTICAL_WIDTH, GUIDE_HORIZONTAL_WIDTH, SELECTION_BORDER_WIDTH, GUIDE_LINE_WIDTH);
	}, [guides, measurementLines, elementsMaxX, elementsMaxY, GUIDE_VERTICAL_PADDING, GUIDE_HORIZONTAL_PADDING]);

	const stageWidth = facadeSizeX / SCALE + PADDING.left + PADDING.right + GUIDE_VERTICAL_PADDING + GUIDE_VERTICAL_WIDTH;
	const stageHeight = facadeSizeY / SCALE + PADDING.top + PADDING.bottom + GUIDE_HORIZONTAL_PADDING + GUIDE_HORIZONTAL_WIDTH;

	return {
		SCALE,
		PADDING,
		GUIDE_VERTICAL_WIDTH,
		GUIDE_HORIZONTAL_WIDTH,
		SELECTION_BORDER_WIDTH,
		SELECTION_BORDER_WIDTH_HALF,
		GUIDE_VERTICAL_PADDING,
		GUIDE_HORIZONTAL_PADDING,
		GUIDE_LINE_WIDTH,
		elementsMinX,
		elementsMinY,
		elementsMaxX,
		elementsMaxY,
		facadeSizeX,
		facadeSizeY,
		stageWidth,
		stageHeight,
		transformedElements,
		transformedGuides,
		nestedElementGroups,
		measurementLines
	};
};

export default useCanvasData;
