export const calculateMaxCoordinates = (elements) => {
	if (elements.length === 0) {
		return { elementsMinX: 0, elementsMinY: 0, elementsMaxX: 0, elementsMaxY: 0, facadeSizeX: 0, facadeSizeY: 0 };
	}
	const elementsMinX_massive = elements.map((el) => el.left);
	const elementsMinY_massive = elements.map((el) => el.bottom);
	const elementsMaxX_massive = elements.map((el) => el.left + el.width);
	const elementsMaxY_massive = elements.map((el) => el.bottom + el.height);
	const elementsMinX = Math.min(...elementsMinX_massive);
	const elementsMinY = Math.min(...elementsMinY_massive);
	const elementsMaxX = Math.max(...elementsMaxX_massive);
	const elementsMaxY = Math.max(...elementsMaxY_massive);

	const facadeSizeX = elementsMaxX - elementsMinX;
	const facadeSizeY = elementsMaxY - elementsMinY;

	return { elementsMinX, elementsMinY, elementsMaxX, elementsMaxY, facadeSizeX, facadeSizeY };
};

export const transformElements = (elements, minX, maxY, SCALE, PADDING) => {
	return elements.map((el) => ({
		...el,
		drawAreaRect: {
			x: PADDING.left + (-minX + el.left) / SCALE + 0.5,
			y: PADDING.left + (maxY - el.bottom - el.height) / SCALE + 0.5,
			width: el.width / SCALE - 1,
			height: el.height / SCALE - 1
		},
		drawAreaInsideRect: {
			x: PADDING.left + (-minX + el.left) / SCALE + 1,
			y: PADDING.left + (maxY - el.bottom - el.height) / SCALE + 1,
			width: el.width / SCALE - 2,
			height: el.height / SCALE - 2
		},
		drawAreaText: {
			x: PADDING.left + (-minX + el.left) / SCALE + 1,
			y: PADDING.left + (maxY - el.bottom - el.height) / SCALE + 1,
			width: el.width / SCALE - 2,
			height: el.height / SCALE - 2
		},
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
};

export const transformGuides = (guides, minX, minY, maxX, maxY, SCALE, PADDING, GUIDE_VERTICAL_PADDING, GUIDE_HORIZONTAL_PADDING, GUIDE_VERTICAL_WIDTH, GUIDE_HORIZONTAL_WIDTH, LINE_WIDTH, GUIDE_LINE_WIDTH) => {
	return guides
		.map((guide) => {
			const isHorizontal = guide.direction === 'horizontal';
			const x = isHorizontal ? PADDING.left + (guide.coordinate - minX) / SCALE : PADDING.left + (maxX - minX) / SCALE + GUIDE_VERTICAL_PADDING;
			const y = isHorizontal ? PADDING.top + (maxY - minY) / SCALE + GUIDE_HORIZONTAL_PADDING : PADDING.top + (maxY - guide.coordinate - guide.size) / SCALE;
			const width = isHorizontal ? guide.size / SCALE : GUIDE_VERTICAL_WIDTH;
			const height = isHorizontal ? GUIDE_HORIZONTAL_WIDTH : guide.size / SCALE;

			const LINE_W = 1.25;
			const LINE_W_HALF = LINE_W / 2;

			const draw_rect_x = isHorizontal ? x + LINE_W_HALF : x;
			const draw_rect_y = isHorizontal ? y : y + LINE_W_HALF;
			const draw_rect_width = isHorizontal ? width - LINE_W : GUIDE_VERTICAL_WIDTH;
			const draw_rect_height = isHorizontal ? GUIDE_HORIZONTAL_WIDTH : height - LINE_W;

			const line_points = isHorizontal ? [x, y - GUIDE_LINE_WIDTH, x, y] : [x - GUIDE_LINE_WIDTH, y, x, y];

			const fontSize = 16;

			return {
				...guide,
				drawCoords: {
					x: draw_rect_x,
					y: draw_rect_y,
					width: draw_rect_width,
					height: draw_rect_height
				},
				linePoints: line_points,
				fontSize,
				coordinateText: isHorizontal ? '' : guide.size.toString()
			};
		})
		.sort((a, b) => a.coordinate - b.coordinate);
};

export const buildNestedElementGroups = (elementGroups, elements) => {
	const groupMap = new Map();

	elementGroups.forEach((group) => {
		groupMap.set(group.id, { ...group, children: [], elements: [] });
	});

	elements.forEach((element) => {
		const group = groupMap.get(element.element_group_id);
		if (group) {
			group.elements.push(element);
		}
	});

	const nestedGroups = [];
	groupMap.forEach((group) => {
		if (group.parent_id) {
			const parentGroup = groupMap.get(group.parent_id);
			if (parentGroup) {
				parentGroup.children.push(group);
			}
		} else {
			nestedGroups.push(group);
		}
	});

	return nestedGroups;
};

export const generateMeasurementLines = (minX, minY, maxX, maxY, elements, SCALE, PADDING, MEASUREMENT_LINE_FONT_SIZE) => {
	const horizontalLine = {
		coordinates: [PADDING.left, (maxY - minY) / SCALE + PADDING.top, (maxX - minX) / SCALE + PADDING.left, (maxY - minY) / SCALE + PADDING.top],
		text: `${maxX}`,
		offsetSelfHalfSize: 1 * 1,
		offset: 2 * 1,
		fontColor: 'orange',
		fontSize: MEASUREMENT_LINE_FONT_SIZE
	};

	const verticalLine = {
		coordinates: [(maxX - minX) / SCALE + PADDING.left, PADDING.top, (maxX - minX) / SCALE + PADDING.left, (maxY - minY) / SCALE + PADDING.top],
		text: `${maxY}`,
		offsetSelfHalfSize: 1 * -1,
		offset: 2 * -1,
		fontColor: 'orange',
		fontSize: MEASUREMENT_LINE_FONT_SIZE
	};

	const uniqueHorizontalSegments = new Set();

	elements.forEach((el) => {
		const horizontalSegment = `${el.left},${el.left + el.width}`;
		if (!uniqueHorizontalSegments.has(horizontalSegment)) {
			uniqueHorizontalSegments.add(horizontalSegment);
		}
	});

	const calculateLevels = (segments) => {
		const levels = [];
		segments.forEach((segment) => {
			let placed = false;
			for (let level of levels) {
				if (level.every((s) => s.end <= segment.start || s.start >= segment.end)) {
					level.push(segment);
					placed = true;
					break;
				}
			}
			if (!placed) {
				levels.push([segment]);
			}
		});
		return levels;
	};

	const horizontalLevels = calculateLevels(
		Array.from(uniqueHorizontalSegments).map((segment) => {
			const [start, end] = segment.split(',').map(Number);
			return { start, end, size: end - start };
		})
	);

	const columns = getVerticalColumns(elements);
	const uniqueVerticalSegments = new Set();
	const verticalLevels = [];

	columns.forEach((column) => {
		const columnSegments = new Set();

		column.forEach((el) => {
			const verticalSegment = `${el.bottom},${el.bottom + el.height}`;
			if (!columnSegments.has(verticalSegment) && !uniqueVerticalSegments.has(verticalSegment) && el.height > 0) {
				columnSegments.add(verticalSegment);
				uniqueVerticalSegments.add(verticalSegment);
			}
		});

		const columnLevel = Array.from(columnSegments).map((segment) => {
			const [start, end] = segment.split(',').map(Number);
			return { start, end, size: end - start };
		});

		if (columnLevel.length > 0) {
			verticalLevels.push(columnLevel);
		}
	});

	const horizontalLines = horizontalLevels
		.flatMap((level, index) =>
			level.map((segment) => ({
				coordinates: [PADDING.left + (segment.start - minX) / SCALE, PADDING.top + (maxY - minY) / SCALE, PADDING.left + (segment.end - minX) / SCALE, PADDING.top + (maxY - minY) / SCALE],
				text: `${segment.size}`,
				offsetSelfHalfSize: (3 + index * 2) * 1,
				offset: (2 + (index + 1) * 3) * 1,
				fontColor: 'black',
				fontSize: MEASUREMENT_LINE_FONT_SIZE,
				selectionProps: {
					direction: 'horizontal',
					coordinate: segment.start,
					size: segment.size
				}
			}))
		)
		.sort((a, b) => a.selectionProps.coordinate - b.selectionProps.coordinate);

	const verticalLines = verticalLevels
		.flatMap((level, index) =>
			level.map((segment) => ({
				coordinates: [PADDING.left + (maxX - minX) / SCALE, PADDING.top + maxY / SCALE - segment.end / SCALE, PADDING.left + (maxX - minX) / SCALE, PADDING.top + maxY / SCALE - segment.start / SCALE],
				text: `${segment.size}`,
				offsetSelfHalfSize: (3 + index * 2) * -1,
				offset: (2 + (index + 1) * 3) * -1,
				fontColor: 'black',
				fontSize: MEASUREMENT_LINE_FONT_SIZE,
				selectionProps: {
					direction: 'vertical',
					coordinate: segment.start,
					size: segment.size
				}
			}))
		)
		.sort((a, b) => a.selectionProps.coordinate - b.selectionProps.coordinate);

	return {
		linesCount: {
			horizontal: horizontalLevels.length + 1,
			vertical: verticalLevels.length + 1
		},
		measurementLines: [horizontalLine, verticalLine, ...horizontalLines, ...verticalLines]
	};
};

export const getVerticalColumns = (elements) => {
	const columns = [];
	const visited = new Set();

	elements.forEach((element) => {
		if (visited.has(element.id)) return;

		const currentLeft = Number(element.left);

		const column = elements.filter((el) => Number(el.left) === currentLeft).sort((a, b) => Number(a.bottom) - Number(b.bottom));

		column.forEach((el) => visited.add(el.id));
		columns.push(column);
	});

	return columns;
};

export function getAffectedElements(elements, selectedElements, changeType) {
	if (!selectedElements.length) return [];

	const numElements = elements.map((el) => ({
		...el,
		left: Number(el.left),
		bottom: Number(el.bottom),
		width: Number(el.width),
		height: Number(el.height)
	}));

	const numSelected = selectedElements.map((el) => ({
		...el,
		left: Number(el.left),
		bottom: Number(el.bottom),
		width: Number(el.width),
		height: Number(el.height)
	}));

	const columns = getVerticalColumns(numElements);

	if (changeType === 'width') {
		const maxRight = Math.max(...numSelected.map((el) => el.left + el.width));
		return columns.filter((col) => col.some((el) => el.left >= maxRight)).map((col) => col.filter((el) => el.left >= maxRight));
	}

	if (changeType === 'height') {
		const selectedLeftValues = new Set(numSelected.map((el) => el.left));
		const validColumns = columns.filter((col) => col.some((el) => selectedLeftValues.has(el.left)));
		const validElements = validColumns.flat();
		const minBottom = Math.min(...numSelected.map((el) => el.bottom));

		return validElements
			.filter((el) => el.bottom > minBottom)
			.reduce((groups, el) => {
				const row = groups.find((group) => group[0].bottom === el.bottom);
				if (row) row.push(el);
				else groups.push([el]);
				return groups;
			}, []);
	}

	return [];
}

export const createGuidesFromMeasurementLines = (measurementLines) => {
	return measurementLines
		.filter((line) => line.selectionProps?.direction === 'horizontal')
		.map((line, index) => ({
			id: `generated-guide-${index}`,
			direction: 'horizontal',
			coordinate: line.selectionProps.coordinate,
			size: line.selectionProps.size,
			title: String.fromCharCode(65 + index)
		}));
};
