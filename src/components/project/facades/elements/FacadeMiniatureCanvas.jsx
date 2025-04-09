import React from 'react';
import { Stage, Layer, Rect, Text, Line } from 'react-konva';
import { useFacadeCalculations } from '@hooks/facades/main_page/useFacadeCalculations';

const FacadeMiniatureCanvas = ({ elements, guides }) => {
	const { stageWidth, stageHeight, transformedElements, transformedGuides, LINE_WIDTH } = useFacadeCalculations(elements, guides);

	return (
		<div className="d-flex justify-content-center align-items-center">
			<Stage width={stageWidth} height={stageHeight}>
				<Layer>
					{transformedElements.map((el) => (
						<Rect key={el.id} x={el.x} y={el.y} width={el.width} height={el.height} {...el.style} stroke="black" strokeWidth={1} />
					))}
					{transformedGuides.map((guide) => (
						<React.Fragment key={guide.id}>
							<Rect x={guide.rectProps.x} y={guide.rectProps.y} width={guide.rectProps.width} height={guide.rectProps.height} fill="DimGray" />
							<Text x={guide.rectProps.x} y={guide.rectProps.y} width={guide.rectProps.width} height={guide.rectProps.height} text={guide.title} fontSize={guide.fontSize} align="center" verticalAlign="middle" fill="orange" fontFamily="sans-serif" fontStyle="bold" wrap="none" />
							<Line points={guide.linePoints} stroke="orange" strokeWidth={LINE_WIDTH} />
						</React.Fragment>
					))}
				</Layer>
			</Stage>
		</div>
	);
};

export default FacadeMiniatureCanvas;
