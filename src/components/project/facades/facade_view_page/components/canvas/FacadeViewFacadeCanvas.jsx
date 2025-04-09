import React from 'react';
import { Stage, Layer } from 'react-konva';
import { useFacadeViewCanvas } from '@contexts/facades_view/FacadeViewCanvasContext';
import GuidesLayer from '@components/project/facades/facade_view_page/components/canvas/canvas_containers/GuidesLayer';
import NestedElementGroups from '@components/project/facades/facade_view_page/components/canvas/canvas_containers/NestedElementGroups';
import MeasurementLinesLayer from '@components/project/facades/facade_view_page/components/canvas/canvas_containers/MeasurementLinesLayer';
import HoveredElementLayer from '@components/project/facades/facade_view_page/components/canvas/canvas_containers/HoveredElementLayer';
import SelectionStartLayer from '@components/project/facades/facade_view_page/components/canvas/canvas_containers/SelectionStartLayer';
import SelectionActiveLayer from '@components/project/facades/facade_view_page/components/canvas/canvas_containers/SelectionActiveLayer';

const FacadeViewFacadeCanvas = () => {
	const { stageWidth, stageHeight, transformedElements, transformedGuides, nestedElementGroups, measurementLines } = useFacadeViewCanvas();

	const preventDefaultContextMenu = (e) => {
		e.evt.preventDefault();
		e.evt.stopPropagation();
		return false;
	};

	return (
		<div className="d-flex flex-row justify-content-around gap-4 border border-1 border-dark overflow-auto">
			<Stage width={stageWidth} height={stageHeight} onContextMenu={preventDefaultContextMenu}>
				<Layer>
					<SelectionStartLayer />
					<NestedElementGroups groups={nestedElementGroups} />
				</Layer>

				<Layer>
					<GuidesLayer guides={transformedGuides} />
					<MeasurementLinesLayer measurementLines={measurementLines} />
					<HoveredElementLayer />
					<SelectionActiveLayer />
				</Layer>
			</Stage>
		</div>
	);
};

export default FacadeViewFacadeCanvas;
