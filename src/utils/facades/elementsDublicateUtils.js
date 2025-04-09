export const handleHoveredElementMarkerClick = async ({ hoveredElement, elements, direction, dispatch, facadeId, massUpdateElementsArray, createElement, fetchElementsByFacadeId }) => {
	if (!hoveredElement) return;

	const createNewElement = (modifications) => ({
		...hoveredElement,
		id: null,
		left: hoveredElement.left,
		bottom: hoveredElement.bottom,
		height: hoveredElement.height,
		width: hoveredElement.width,
		...modifications
	});

	const updateElements = async (elementsToUpdate, newElementData) => {
		if (elementsToUpdate.length > 0) {
			await dispatch(
				massUpdateElementsArray({
					facadeId,
					data: { elements: elementsToUpdate }
				})
			).unwrap();
		}

		if (newElementData) {
			await dispatch(
				createElement({
					facadeId,
					data: newElementData
				})
			).unwrap();
		}

		await dispatch(fetchElementsByFacadeId(facadeId)).unwrap();
	};

	try {
		switch (direction) {
			case 'left': {
				const hoveredLeft = hoveredElement.left;
				const hoveredWidth = hoveredElement.width;

				const elementsToUpdate = elements
					.filter((el) => el.left >= hoveredLeft)
					.map((el) => ({
						...el,
						left: el.left + hoveredWidth
					}));

				const newElementData = createNewElement({
					left: hoveredLeft
				});

				await updateElements(elementsToUpdate, newElementData);
				break;
			}

			case 'right': {
				const hoveredLeft = hoveredElement.left;
				const hoveredWidth = hoveredElement.width;

				const elementsToUpdate = elements
					.filter((el) => el.left >= hoveredLeft + hoveredWidth)
					.map((el) => ({
						...el,
						left: el.left + hoveredWidth
					}));

				const newElementData = createNewElement({
					left: hoveredLeft + hoveredWidth
				});

				await updateElements(elementsToUpdate, newElementData);
				break;
			}

			case 'top': {
				const hoveredBottom = hoveredElement.bottom;
				const hoveredHeight = hoveredElement.height;
				const hoveredRight = hoveredElement.left + hoveredElement.width;

				const elementsAbove = elements.filter((el) => {
					return el.left >= hoveredElement.left && el.left < hoveredRight && el.bottom >= hoveredBottom + hoveredHeight;
				});

				const elementsToUpdate = elementsAbove.map((el) => ({
					...el,
					bottom: el.bottom + hoveredHeight
				}));

				const newElementData = createNewElement({
					bottom: hoveredBottom + hoveredHeight
				});

				await updateElements(elementsToUpdate, newElementData);
				break;
			}

			case 'bottom': {
				const hoveredBottom = hoveredElement.bottom;
				const hoveredHeight = hoveredElement.height;
				const hoveredRight = hoveredElement.left + hoveredElement.width;

				const columnElements = elements.filter((el) => {
					return el.left >= hoveredElement.left && el.left < hoveredRight && el.bottom <= hoveredBottom;
				});

				const elementsToUpdate = columnElements.map((el) => ({
					...el,
					bottom: el.bottom + hoveredHeight
				}));

				const newElementData = createNewElement({
					bottom: hoveredBottom
				});

				await updateElements(elementsToUpdate, newElementData);
				break;
			}

			default:
				return;
		}
	} catch (error) {
		console.error(`Ошибка при обработке направления ${direction}:`, error);
	}
};
