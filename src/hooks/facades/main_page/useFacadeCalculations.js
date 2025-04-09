import { useMemo } from 'react';

const SCALE = 60;
const PADDING = 1;
const GUIDE_PADDING = 6;
const GUIDE_VERTICAL_WIDTH = 30;
const GUIDE_HORIZONTAL_WIDTH = 15;
const LINE_WIDTH = 1.25;

export const useFacadeCalculations = (elements, guides) => {
	const { maxX, maxY } = useMemo(() => {
		if (elements.length === 0) {
			return { maxX: 0, maxY: 0 };
		}
		const maxX_massive = elements.map((el) => el.left + el.width);
		const maxY_massive = elements.map((el) => el.bottom + el.height);
		const maxX = Math.max(...maxX_massive);
		const maxY = Math.max(...maxY_massive);
		return { maxX, maxY };
	}, [elements]);

	const stageWidth = useMemo(() => maxX / SCALE + PADDING * 2 + GUIDE_PADDING + GUIDE_VERTICAL_WIDTH, [maxX]);
	const stageHeight = useMemo(() => maxY / SCALE + PADDING * 2 + GUIDE_PADDING + GUIDE_HORIZONTAL_WIDTH, [maxY]);

	const transformedElements = useMemo(() => {
		return elements.map((el) => ({
			...el,
			x: PADDING + el.left / SCALE + 0.5,
			y: PADDING + (maxY - el.bottom - el.height) / SCALE + 0.5,
			width: el.width / SCALE - 1,
			height: el.height / SCALE - 1,
			style: {
				fillLinearGradientStartPoint: { x: 0, y: el.height / SCALE },
				fillLinearGradientEndPoint: { x: 0, y: 0 },
				fillLinearGradientColorStops: JSON.parse(el.type.style)
					.map((color, index) => {
						return [index, color];
					})
					.flat()
			}
		}));
	}, [elements, maxY]);

	const horizontalGuides = useMemo(() => {
		const uniqueHorizontalSegments = new Set();

		elements.forEach((el) => {
			const horizontalSegment = `${el.left},${el.left + el.width}`;
			if (!uniqueHorizontalSegments.has(horizontalSegment)) {
				uniqueHorizontalSegments.add(horizontalSegment);
			}
		});

		return Array.from(uniqueHorizontalSegments).map((segment, index) => {
			const [start, end] = segment.split(',').map(Number);
			const size = end - start;

			const title = String.fromCharCode(65 + index);

			return {
				id: `horizontal-guide-${index}`,
				direction: 'horizontal',
				coordinate: start,
				size,
				title
			};
		});
	}, [elements]);

	const transformedGuides = useMemo(() => {
		const combinedGuides = [...guides, ...horizontalGuides];

		return combinedGuides.map((guide) => {
			const isHorizontal = guide.direction === 'horizontal';
			const x = isHorizontal ? PADDING + guide.coordinate / SCALE : PADDING + maxX / SCALE + GUIDE_PADDING;
			const y = isHorizontal ? PADDING + maxY / SCALE + GUIDE_PADDING : PADDING + (maxY - guide.coordinate - guide.size) / SCALE;
			const width = isHorizontal ? guide.size / SCALE : GUIDE_VERTICAL_WIDTH;
			const height = isHorizontal ? GUIDE_HORIZONTAL_WIDTH : guide.size / SCALE;

			const rect_x = isHorizontal ? x + LINE_WIDTH / 2 : x;
			const rect_y = isHorizontal ? y : y + LINE_WIDTH / 2;
			const rect_width = isHorizontal ? width - LINE_WIDTH : GUIDE_VERTICAL_WIDTH;
			const rect_height = isHorizontal ? GUIDE_HORIZONTAL_WIDTH : height - LINE_WIDTH;

			const line_points = isHorizontal ? [x, y - GUIDE_PADDING, x, y + height] : [x - GUIDE_PADDING, y, x + width, y];

			const fontSize = isHorizontal ? 8 : 14;

			return {
				...guide,
				rectProps: {
					x: rect_x,
					y: rect_y,
					width: rect_width,
					height: rect_height
				},
				linePoints: line_points,
				fontSize
			};
		});
	}, [guides, horizontalGuides, maxX, maxY]);

	return { stageWidth, stageHeight, transformedElements, transformedGuides, LINE_WIDTH };
};
