import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectElementStatusesByElementId } from '@slices/statuses/elementStatusesSlice';
import { Rect, Text, Circle, RegularPolygon } from 'react-konva';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';

const ElementStatus = ({ element }) => {
	const { openStatusGroups } = useFacadeViewPage();
	const elementStatuses = useSelector((state) => selectElementStatusesByElementId(state, element.id));
	const statusesById = useSelector((state) => state.statuses.byId);
	const statusGroupsById = useSelector((state) => state.statusGroups.byId);

	// Фильтруем статусы, которые принадлежат открытым группам
	const filteredStatuses = useMemo(() => {
		// console.log('filteredStatuses', elementStatuses, statusesById, openStatusGroups);
		if (!elementStatuses || !statusesById) return [];
		return elementStatuses.filter((elementStatus) => {
			const status = statusesById[elementStatus.status_id];
			return status && openStatusGroups.includes(status.status_group_id);
		});
	}, [elementStatuses, statusesById, openStatusGroups]);

	// Сортируем статусы по дате создания
	const sortedStatuses = useMemo(() => {
		return filteredStatuses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
	}, [filteredStatuses]);

	const latestStatus = sortedStatuses[0];
	const status = latestStatus ? statusesById[latestStatus.status_id] : null;

	const color = status ? status.color : 'black';
	const statusIndex = status ? parseInt(status.index_style) : 0;

	const gradientPattern = useMemo(() => {
		const createGradientPattern = (color) => {
			const canvas = document.createElement('canvas');
			const squareSize = 8;
			const squareSizeHalf = squareSize / 2;
			canvas.width = squareSize;
			canvas.height = squareSize;
			const ctx = canvas.getContext('2d');
			ctx.strokeStyle = color;
			ctx.lineWidth = 2.5;
			ctx.beginPath();
			ctx.moveTo(0, -squareSizeHalf);
			ctx.lineTo(squareSize + squareSizeHalf, squareSize);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(-squareSizeHalf, 0);
			ctx.lineTo(squareSize, squareSize + squareSizeHalf);
			ctx.stroke();
			ctx.closePath();
			return canvas;
		};

		return createGradientPattern(color);
	}, [color]);

	const crossPattern = useMemo(() => {
		const canvas = document.createElement('canvas');
		canvas.width = element.drawAreaInsideRect.width;
		canvas.height = element.drawAreaInsideRect.height;
		const ctx = canvas.getContext('2d');
		ctx.strokeStyle = color;
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(element.drawAreaInsideRect.width, element.drawAreaInsideRect.height);
		ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
		ctx.moveTo(element.drawAreaInsideRect.width, 0);
		ctx.lineTo(0, element.drawAreaInsideRect.height);
		ctx.stroke();
		ctx.closePath();
		return canvas;
	}, [color, element]);

	switch (statusIndex) {
		case 1:
			return <Rect x={element.drawAreaInsideRect.x} y={element.drawAreaInsideRect.y} width={element.drawAreaInsideRect.width} height={element.drawAreaInsideRect.height} fillPatternImage={crossPattern} listening={false} />;
		case 2:
			return <Circle x={element.drawAreaInsideRect.x + element.drawAreaInsideRect.width / 2} y={element.drawAreaInsideRect.y + element.drawAreaInsideRect.height / 2} radius={10} fill={color} stroke="black" strokeWidth={1} listening={false} />;
		case 3:
			return <RegularPolygon x={element.drawAreaInsideRect.x + element.drawAreaInsideRect.width / 2} y={element.drawAreaInsideRect.y + element.drawAreaInsideRect.height / 2} sides={3} radius={10} fill={color} stroke="black" strokeWidth={1} listening={false} />;
		case 4:
			return <Rect x={element.drawAreaInsideRect.x + 3} y={element.drawAreaInsideRect.y + 3} width={element.drawAreaInsideRect.width - 6} height={element.drawAreaInsideRect.height - 6} stroke={color} strokeWidth={6} listening={false} />;
		case 5:
			return <Rect x={element.drawAreaInsideRect.x} y={element.drawAreaInsideRect.y} width={element.drawAreaInsideRect.width} height={element.drawAreaInsideRect.height} fillPatternImage={gradientPattern} listening={false} />;
		case 6:
			return <Rect x={element.drawAreaInsideRect.x} y={element.drawAreaInsideRect.y} width={element.drawAreaInsideRect.width} height={element.drawAreaInsideRect.height} fill={color} listening={false} />;
		case 7:
			return <Text x={element.drawAreaInsideRect.x} y={element.drawAreaInsideRect.y} width={element.drawAreaInsideRect.width} height={element.drawAreaInsideRect.height} text={status.acronym} fill={color} stroke="black" strokeWidth={1} fontSize={32} fontFamily="sans-serif" fontStyle="bold" align="center" verticalAlign="middle" listening={false} />;
		case 8:
			return <Text x={element.drawAreaInsideRect.x} y={element.drawAreaInsideRect.y} width={element.drawAreaInsideRect.width} height={element.drawAreaInsideRect.height} text={status.acronym} fill={color} stroke="black" strokeWidth={1} fontSize={22} fontFamily="sans-serif" fontStyle="bold" align="center" verticalAlign="middle" listening={false} />;
		default:
			return null;
	}
};

export default ElementStatus;
