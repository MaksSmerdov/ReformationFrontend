export const getExactElementsInRange = (elements, direction, coordinate, size) => {
	return elements.filter((element) => {
		if (direction === 'horizontal') {
			return element.left == coordinate && element.width == size;
		} else {
			return element.bottom == coordinate && element.height == size;
		}
	});
};

export const getElementsInRange = (elements, direction, coordinate, size) => {
	const rangeEnd = coordinate + size;
	return elements.filter((element) => {
		if (direction === 'horizontal') {
			return element.left >= coordinate && element.left < rangeEnd;
		} else {
			return element.bottom >= coordinate && element.bottom < rangeEnd;
		}
	});
};

export const getOverlappingElementsInRange = (elements, direction, coordinate, size) => {
	const rangeEnd = coordinate + size;
	return elements.filter((element) => {
		if (direction === 'horizontal') {
			return element.left + element.width > coordinate && element.left < rangeEnd;
		} else {
			return element.bottom + element.height > coordinate && element.bottom < rangeEnd;
		}
	});
};
