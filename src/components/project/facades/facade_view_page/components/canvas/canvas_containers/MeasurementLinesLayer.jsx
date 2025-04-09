import React from 'react';
import { Layer } from 'react-konva';
import MeasurementLine from '@components/project/facades/facade_view_page/components/canvas/simple/MeasurementLine';
import { getAffectedElements } from '@utils/facades/facadeUtils';
import { fetchElementsByFacadeId, massUpdateElementsArray, selectElementsByFacadeId, selectElementsByIds } from '@slices/facades/elementsSlice';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';
import { useDispatch, useSelector } from 'react-redux';
import { generateElementTitle } from '@utils/facades/elementUtils';

const MeasurementLinesLayer = ({ measurementLines }) => {
	const { selectedElementIds, facadeId } = useFacadeViewPage();
	const elements = useSelector((state) => selectElementsByFacadeId(state, facadeId));
	const selectedElements = useSelector((state) => selectElementsByIds(state, selectedElementIds));
	const dispatch = useDispatch();

	const handleMassUpdate = async (oldText, newText, clickedElements = null, direction) => {
		const elementsToUpdate = clickedElements || selectedElements;
		const elementIdsToUpdate = clickedElements ? clickedElements.map((el) => el.id) : selectedElementIds;

		if (!elementIdsToUpdate.length) {
			console.log('No elements to update');
			return;
		}

		const updates = [];

		if (direction === 'vertical' && oldText !== newText) {
			if (newText === '') {
				return;
			}

			if (parseInt(newText) < 0) {
				newText = 0;
			}

			const affectedRows = getAffectedElements(elements, elementsToUpdate, 'height');
			const heightDiff = parseInt(oldText) - parseInt(newText);

			elementsToUpdate.forEach((element) => {
				const updatedElement = {
					id: element.id,
					height: newText,
					title: generateElementTitle(element, { height: newText })
				};
				updates.push(updatedElement);
			});

			affectedRows.forEach((row) => {
				row.forEach((el) => {
					const newBottom = heightDiff > 0 ? el.bottom - Math.abs(heightDiff) : el.bottom + Math.abs(heightDiff);
					updates.push({
						id: el.id,
						bottom: newBottom.toString(),
						title: generateElementTitle(el, { bottom: newBottom })
					});
				});
			});
		}

		if (direction === 'horizontal' && oldText !== newText) {
			if (newText === '') {
				return;
			}

			if (parseInt(newText) < 1) {
				newText = 1;
			}

			const affectedColumns = getAffectedElements(elements, elementsToUpdate, 'width');
			const widthDiff = parseInt(oldText) - parseInt(newText);

			elementsToUpdate.forEach((element) => {
				const updatedElement = {
					id: element.id,
					width: newText,
					title: generateElementTitle(element, { width: newText })
				};
				updates.push(updatedElement);
			});

			affectedColumns.forEach((column) => {
				column.forEach((el) => {
					const newLeft = widthDiff > 0 ? el.left - Math.abs(widthDiff) : el.left + Math.abs(widthDiff);
					updates.push({
						id: el.id,
						left: newLeft.toString(),
						title: generateElementTitle(el, { left: newLeft })
					});
				});
			});
		}

		try {
			await dispatch(massUpdateElementsArray({ facadeId, data: { elements: updates } })).unwrap();
			await dispatch(fetchElementsByFacadeId(facadeId)).unwrap();
		} catch (error) {
			console.error('Update failed:', error);
		}
	};

	return (
		<>
			{measurementLines.map((line, index) => (
				<MeasurementLine key={`${line.id}-${index}`} {...line} handleMassUpdate={handleMassUpdate} />
			))}
		</>
	);
};

export default MeasurementLinesLayer;
