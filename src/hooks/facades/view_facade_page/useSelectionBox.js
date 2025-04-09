import { useState } from 'react';

const useSelectionBox = ({ transformedElements, selectedElementIds, setSelectedElementIds }) => {
	const [isSelecting, setIsSelecting] = useState(false);
	const [selectionBox, setSelectionBox] = useState(null);

	const handleSelectionStart = (e) => {
		const stage = e.target.getStage();
		const pointerPosition = stage.getPointerPosition();
		setSelectionBox({
			x: pointerPosition.x,
			y: pointerPosition.y,
			width: 0,
			height: 0
		});
		setIsSelecting(true);
	};

	const handleSelectionMove = (e) => {
		if (!isSelecting || !selectionBox) return;
		if (e.evt.button !== 0) return;

		const stage = e.target.getStage();
		const pointerPosition = stage.getPointerPosition();

		const newWidth = pointerPosition.x - selectionBox.x;
		const newHeight = pointerPosition.y - selectionBox.y;

		setSelectionBox({
			...selectionBox,
			width: newWidth,
			height: newHeight
		});
	};

	const handleSelectionEnd = (e) => {
		if (!isSelecting || !selectionBox) return;

		const { x, y, width, height } = selectionBox;

		const selectionLeft = Math.min(x, x + width);
		const selectionRight = Math.max(x, x + width);
		const selectionTop = Math.min(y, y + height);
		const selectionBottom = Math.max(y, y + height);

		const overlappingElements = transformedElements.filter((element) => {
			const { drawAreaRect } = element;

			const elementLeft = drawAreaRect.x;
			const elementRight = drawAreaRect.x + drawAreaRect.width;
			const elementTop = drawAreaRect.y;
			const elementBottom = drawAreaRect.y + drawAreaRect.height;

			return elementRight > selectionLeft && elementLeft < selectionRight && elementBottom > selectionTop && elementTop < selectionBottom;
		});

		const inAreaElementIds = overlappingElements.map((element) => element.id);

		let newSelectedElementIds;
		if (e.evt.altKey) {
			// исключаем элементы, которые уже выбраны
			newSelectedElementIds = selectedElementIds.filter((id) => !inAreaElementIds.includes(id));
		} else {
			if (e.evt.ctrlKey) {
				// добавляем элементы, которые не выбраны
				newSelectedElementIds = [...selectedElementIds, ...inAreaElementIds.filter((id) => !selectedElementIds.includes(id))];
			} else {
				if (e.evt.shiftKey) {
					// заменяем все выбранные элементы на новые
					newSelectedElementIds = inAreaElementIds;
				} else {
					// добавляем элементы, которые не выбраны и исключаем элементы, которые уже выбраны
					newSelectedElementIds = [...selectedElementIds.filter((id) => !inAreaElementIds.includes(id)), ...inAreaElementIds.filter((id) => !selectedElementIds.includes(id))];
				}
			}
		}

		setSelectedElementIds(newSelectedElementIds);

		setSelectionBox(null);
		setIsSelecting(false);
	};

	return {
		isSelecting,
		selectionBox,
		handleSelectionStart,
		handleSelectionMove,
		handleSelectionEnd
	};
};

export default useSelectionBox;
