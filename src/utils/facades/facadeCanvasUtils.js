export const checkElementsOverlap = (elements) => {
	const overlappingPairs = [];

	for (let i = 0; i < elements.length; i++) {
		for (let j = i + 1; j < elements.length; j++) {
			const el1 = elements[i];
			const el2 = elements[j];

			const el1Left = parseInt(el1.left, 10);
			const el1Right = el1Left + parseInt(el1.width, 10);
			const el1Bottom = parseInt(el1.bottom, 10);
			const el1Top = el1Bottom + parseInt(el1.height, 10);

			const el2Left = parseInt(el2.left, 10);
			const el2Right = el2Left + parseInt(el2.width, 10);
			const el2Bottom = parseInt(el2.bottom, 10);
			const el2Top = el2Bottom + parseInt(el2.height, 10);

			if (el1Left < el2Right && el1Right > el2Left && el1Bottom < el2Top && el1Top > el2Bottom) {
				overlappingPairs.push([el1, el2]);
			}
		}
	}

	return overlappingPairs;
};

export const separateOverlappingElements = (elements) => {
	const updatedElements = [...elements];
	let hasOverlaps = true;
	let iterations = 0;
	const maxIterations = 100;

	while (hasOverlaps && iterations < maxIterations) {
		iterations++;
		hasOverlaps = false;
		const overlaps = checkElementsOverlap(updatedElements);

		if (overlaps.length > 0) {
			hasOverlaps = true;

			for (const [el1, el2] of overlaps) {
				const idx1 = updatedElements.findIndex((e) => e.id === el1.id);
				const idx2 = updatedElements.findIndex((e) => e.id === el2.id);

				if (idx1 === -1 || idx2 === -1) continue;

				const el1Copy = { ...updatedElements[idx1] };
				const el2Copy = { ...updatedElements[idx2] };

				const overlapY = Math.min(parseInt(el1Copy.bottom) + parseInt(el1Copy.height) - parseInt(el2Copy.bottom), parseInt(el2Copy.bottom) + parseInt(el2Copy.height) - parseInt(el1Copy.bottom));

				const overlapX = Math.min(parseInt(el1Copy.left) + parseInt(el1Copy.width) - parseInt(el2Copy.left), parseInt(el2Copy.left) + parseInt(el2Copy.width) - parseInt(el1Copy.left));

				if (overlapY < overlapX) {
					if (parseInt(el1Copy.bottom) < parseInt(el2Copy.bottom)) {
						el2Copy.bottom = (parseInt(el2Copy.bottom) + overlapY).toString();
					} else {
						el1Copy.bottom = (parseInt(el1Copy.bottom) + overlapY).toString();
					}
				} else {
					if (parseInt(el1Copy.left) < parseInt(el2Copy.left)) {
						el2Copy.left = (parseInt(el2Copy.left) + overlapX).toString();
					} else {
						el1Copy.left = (parseInt(el1Copy.left) + overlapX).toString();
					}
				}

				updatedElements[idx1] = el1Copy;
				updatedElements[idx2] = el2Copy;
			}
		}
	}

	return updatedElements;
};

export const calculateMaxCoordinatesWithShift = (elements, elementsMaxX, elementsMaxY, currentMaxX, currentMaxY) => {
	let newMaxX = currentMaxX;
	let newMaxY = currentMaxY;
	let needShiftX = false;
	let needShiftY = false;
	let shiftAmountX = 0;
	let shiftAmountY = 0;

	const minLeft = elements.length > 0 ? Math.min(...elements.map((el) => parseInt(el.left, 10))) : 0;
	const minBottom = elements.length > 0 ? Math.min(...elements.map((el) => parseInt(el.bottom, 10))) : 0;

	if (minLeft < 0) {
		shiftAmountX = Math.abs(minLeft);
		needShiftX = true;
		newMaxX = elementsMaxX + shiftAmountX;
	} else {
		newMaxX = Math.max(elementsMaxX, currentMaxX);
	}

	if (minBottom < 0) {
		shiftAmountY = Math.abs(minBottom);
		needShiftY = true;
		newMaxY = elementsMaxY + shiftAmountY;
	} else {
		newMaxY = Math.max(elementsMaxY, currentMaxY);
	}

	return { newMaxX, newMaxY, needShiftX, needShiftY, shiftAmountX, shiftAmountY };
};

export const willElementOverlapRight = (element, elements) => {
	const newElementLeft = parseInt(element.left, 10) + parseInt(element.width, 10);
	const newElementRight = newElementLeft + parseInt(element.width, 10);
	const newElementBottom = parseInt(element.bottom, 10);
	const newElementTop = newElementBottom + parseInt(element.height, 10);

	return elements.some((el) => {
		const elLeft = parseInt(el.left, 10);
		const elRight = elLeft + parseInt(el.width, 10);
		const elBottom = parseInt(el.bottom, 10);
		const elTop = elBottom + parseInt(el.height, 10);

		return elLeft < newElementRight && elRight > newElementLeft && elBottom < newElementTop && elTop > newElementBottom;
	});
};

// Перенесите hoveredElementMarkerClick сюда, если требуется
