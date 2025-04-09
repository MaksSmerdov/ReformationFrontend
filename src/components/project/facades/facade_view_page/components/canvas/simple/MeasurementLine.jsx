import React, { useState, useRef, useEffect } from 'react';
import { Arrow, Line, Text, Rect } from 'react-konva';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';
import log from 'eslint-plugin-react/lib/util/log.js';
import { useSelector } from 'react-redux';
import { selectElementsByIds } from '@slices/facades/elementsSlice';

const arrowLength = 10,
	arrowThikness = 6;

const MeasurementLine = ({ coordinates, text, textDirection = 'startToEnd', fontSize = 12, offset = 0, offsetSelfHalfSize = 0, fontColor = 'black', selectionProps = {}, handleMassUpdate }) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [currentText, setCurrentText] = useState(text);
	const textRef = useRef(null);
	const { handleMeasurementLineClick, handleMeasurementLineContextClick, changeDirection } = useFacadeViewPage();

	const [real_x1, real_y1, real_x2, real_y2] = coordinates;
	const angle = Math.atan2(real_y2 - real_y1, real_x2 - real_x1);

	const blockWidth = currentText.length * fontSize * 0.65;
	const blockHeight = fontSize + 2;
	const blockHeightHalf = blockHeight / 2;

	const angleCos = Math.cos(angle);
	const angleSin = Math.sin(angle);

	const offsetX = angleCos * (offset + blockHeightHalf * offsetSelfHalfSize);
	const offsetY = angleSin * (offset + blockHeightHalf * offsetSelfHalfSize);

	const x1 = real_x1 - offsetY;
	const y1 = real_y1 + offsetX;
	const x2 = real_x2 - offsetY;
	const y2 = real_y2 + offsetX;

	const midX = (x1 + x2) / 2;
	const midY = (y1 + y2) / 2;

	const lineOffsetX = angleCos * (blockHeightHalf + 0.5);
	const lineOffsetY = angleSin * (blockHeightHalf + 0.5);

	const linePoints1 = [x1 - lineOffsetY, y1 + lineOffsetX, x1 + lineOffsetY, y1 - lineOffsetX];
	const linePoints2 = [x2 - lineOffsetY, y2 + lineOffsetX, x2 + lineOffsetY, y2 - lineOffsetX];

	const handleMouseEnter = () => setIsHovered(true);
	const handleMouseLeave = () => setIsHovered(false);

	const activeMeasurement = Object.keys(selectionProps).length !== 0;

	const handleClick = (e) => {
		e.cancelBubble = true;
		if (e.evt.button === 0) {
			editing(e);
		} else if (e.evt.button === 2) {
			e.evt.preventDefault();
			e.evt.stopPropagation();
			handleContextMenu(e);
		}
	};

	const editing = (e) => {
		// console.log('MeasurementLine editingFunc:', e);

		const textarea = document.createElement('textarea');
		setIsEditing(true);
		document.body.appendChild(textarea);

		const clickResult = handleMeasurementLineClick(selectionProps);
		const { elements: clickedElements } = clickResult;
		changeDirection(selectionProps.direction);
		const textNode = textRef.current;

		textNode.hide();
		const stage = textNode.getStage();
		const textPosition = textNode.absolutePosition();

		const areaPosition = {
			x: stage.container().offsetLeft + textPosition.x,
			y: stage.container().offsetTop + textPosition.y
		};

		textarea.value = currentText;

		Object.assign(textarea.style, {
			display: 'block',
			position: 'absolute',
			top: `${areaPosition.y - textNode.height() / 1.5}px`,
			left: `${areaPosition.x - textNode.width() / 1.5}px`,
			width: `${textNode.width() * 1.5}px`,
			height: `${textNode.height() * 1.5}px`,
			fontSize: `${fontSize}px`,
			fontWeight: '600',
			border: '1px solid black',
			borderRadius: '3px',
			padding: '0px',
			margin: '0px',
			overflow: 'hidden',
			background: 'white',
			outline: 'none',
			fontFamily: 'monospace',
			resize: 'none',
			textAlign: 'center',
			color: fontColor
		});

		textarea.addEventListener('input', (e) => {
			textarea.value = textarea.value.replace(/[^0-9.]/g, '');
		});
		textarea.focus();
		textarea.select();

		const finishEditing = (save) => {
			const newText = textarea.value;
			if (save && newText.trim() !== '') {
				setCurrentText(newText);
				handleMassUpdate(currentText, newText, clickedElements, selectionProps.direction);
			}
			textarea.parentNode.removeChild(textarea);
			window.removeEventListener('click', handleOutsideClick);
			handleMeasurementLineClick(selectionProps);
			setIsEditing(false);
			textNode.show();
		};

		const handleOutsideClick = (e) => {
			if (e.target !== textarea) {
				finishEditing(true);
			}
		};

		textarea.addEventListener('keydown', (e) => {
			if (e.keyCode === 13 && !e.shiftKey) {
				finishEditing(true);
			}
			if (e.keyCode === 27) {
				finishEditing(false);
			}
		});

		setTimeout(() => {
			window.addEventListener('click', handleOutsideClick);
		});
	};

	const handleContextMenu = (e) => {
		e.evt.preventDefault();
		// console.log('MeasurementLine handle ContextMenu:', selectionProps);
		handleMeasurementLineContextClick(selectionProps);
	};

	return (
		<>
			<Arrow pointerAtBeginning={true} points={[x1, y1, x2, y2]} stroke={fontColor} strokeWidth={1} pointerLength={arrowLength} pointerWidth={arrowThikness} fill={fontColor} shadowColor="white" shadowBlur={0} shadowOffset={[1, 2]} listening={false} />
			<Line points={linePoints1} stroke={fontColor} strokeWidth={1} listening={false} />
			<Line points={linePoints2} stroke={fontColor} strokeWidth={1} listening={false} />
			{activeMeasurement ? <Rect x={midX} y={midY} width={blockWidth} height={blockHeight} fill={isHovered ? 'DodgerBlue' : 'white'} stroke={fontColor} strokeWidth={1} cornerRadius={3} rotation={(angle * 180) / Math.PI} offsetX={blockWidth / 2} offsetY={blockHeight / 2} listening={true} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} /> : <Rect x={midX} y={midY} width={blockWidth} height={blockHeight} fill="white" stroke={fontColor} strokeWidth={1} cornerRadius={3} rotation={(angle * 180) / Math.PI} offsetX={blockWidth / 2} offsetY={blockHeight / 2} listening={false} />}
			<Text ref={textRef} x={midX} y={midY} width={blockWidth} height={blockHeight} text={currentText} fontSize={fontSize} fill={fontColor} opacity={isEditing ? 0 : 1} align="center" verticalAlign="middle" fontFamily="monospace" rotation={(angle * 180) / Math.PI} offsetX={blockWidth / 2 + 0.5} offsetY={blockHeight / 2 - 1} listening={false} />
		</>
	);
};

export default MeasurementLine;
