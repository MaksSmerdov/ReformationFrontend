import React, { createContext, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import useCanvasData from '@hooks/facades/view_facade_page/useCanvasData.js';
import { massUpdateElementsArray, createElement, fetchElementsByFacadeId } from '@slices/facades/elementsSlice';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';
import { handleHoveredElementMarkerClick } from '@utils/facades/elementsDublicateUtils';
import useSelectionBox from '@hooks/facades/view_facade_page/useSelectionBox';

const FacadeViewCanvasContext = createContext();

export const FacadeViewCanvasProvider = ({ children, guides, elementGroups, elements }) => {
	const dispatch = useDispatch();
	const { facadeId, selectedElementIds, setSelectedElementIds } = useFacadeViewPage();

	const { SCALE, PADDING, GUIDE_VERTICAL_WIDTH, GUIDE_HORIZONTAL_WIDTH, SELECTION_BORDER_WIDTH, SELECTION_BORDER_WIDTH_HALF, GUIDE_VERTICAL_PADDING, GUIDE_HORIZONTAL_PADDING, GUIDE_LINE_WIDTH, elementsMinX, elementsMinY, elementsMaxX, elementsMaxY, facadeSizeX, facadeSizeY, stageWidth, stageHeight, transformedElements, transformedGuides, nestedElementGroups, measurementLines } = useCanvasData({elements, guides, elementGroups});

	const [hoveredElementId, setHoveredElementId] = useState(null);
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
	const [markersVisible, setMarkersVisible] = useState(true);

	const hoveredElementMarkerClick = async (direction) => {
		const hoveredElement = transformedElements.find((el) => el.id === hoveredElementId);
		if (!hoveredElement) return;

		try {
			setHoveredElementId(null);
			setMarkersVisible(false);

			await handleHoveredElementMarkerClick({
				hoveredElement,
				elements,
				direction,
				dispatch,
				facadeId,
				massUpdateElementsArray,
				createElement,
				fetchElementsByFacadeId
			});
		} catch (error) {
			console.error(`Ошибка при обработке направления ${direction}:`, error);
		} finally {
			setMarkersVisible(true);
		}
	};

	const { isSelecting, selectionBox, handleSelectionStart, handleSelectionMove, handleSelectionEnd } = useSelectionBox({ transformedElements, selectedElementIds, setSelectedElementIds });

	return (
		<FacadeViewCanvasContext.Provider
			value={{
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
				tooltipPosition,
				setTooltipPosition,
				hoveredElementId,
				setHoveredElementId,
				transformedElements,
				transformedGuides,
				nestedElementGroups,
				measurementLines,
				hoveredElementMarkerClick,
				isSelecting,
				selectionBox,
				handleSelectionStart,
				handleSelectionMove,
				handleSelectionEnd
			}}>
			{children}
		</FacadeViewCanvasContext.Provider>
	);
};

export const useFacadeViewCanvas = () => useContext(FacadeViewCanvasContext);
