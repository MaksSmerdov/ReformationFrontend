import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Text, Arrow, Group } from 'react-konva';
import { useNavigate, useParams } from 'react-router-dom';
import WallsConfirmModal
  from '@components/project/rooms/view_apartment_page/components/WallsConfiguration/WallsConfirmModal.jsx';
import {
  scaleFactor,
  calcGaps,
  repositionShapes,
} from '@components/project/rooms/view_apartment_page/components/WallsConfiguration/repositionUtils.js';

const MAX_MM = 9975;
const group1Width = ['seinaA', 'seinaC', 'kattoK', 'lattiaL'];
const group2Width = ['seinaB', 'seinaD'];
const groupHeight = ['seinaA', 'seinaB', 'seinaC', 'seinaD', 'kattoK', 'lattiaL'];

const WallsConfiguration = ({ shapes, setShapes }) => {
  const navigate = useNavigate();
  const { projectId, staircaseId, apartmentId } = useParams();
  const [editing, setEditing] = useState(null);
  const [propModal, setPropModal] = useState(null);
  const [gaps, setGaps] = useState(null);
  const stageRef = useRef(null);

  useEffect(() => {
    if (!gaps && shapes.length) setGaps(calcGaps(shapes));
  }, [gaps, shapes]);

  useEffect(() => {
    const container = stageRef.current?.container();
    if (container && !container.hasAttribute('tabindex')) {
      container.setAttribute('tabindex', '0');
      container.style.outline = 'none';
    }
  }, []);

  const applyReposition = (draft) => gaps ? repositionShapes(draft, gaps) : draft;

  const toggleVisibility = (id) => {
    setShapes((prev) => applyReposition(prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s)));
  };

  const startEdit = (shape, dimension) => {
    setEditing({ id: shape.id, dimension, value: String(shape[dimension]) });
    stageRef.current?.container().focus();
  };

  const abortEdit = () => setEditing(null);

  const commitEdit = () => {
    if (!editing) return;
    const { id, dimension, value } = editing;
    const num = Number(value);
    if (!value.trim() || isNaN(num) || num <= 0 || num > MAX_MM) {
      alert(`Введите число от 1 до ${MAX_MM}`);
      setEditing(null);
      return;
    }
    const original = shapes.find(s => s.id === id);
    if (!original || original[dimension] === num) {
      setEditing(null);
      return;
    }
    setShapes(prev => applyReposition(prev.map(s => s.id === id ? { ...s, [dimension]: num } : s)));
    if (dimension === 'width') {
      if (group1Width.includes(id)) setPropModal({ dimension, newValue: num, group: group1Width });
      else if (group2Width.includes(id)) setPropModal({ dimension, newValue: num, group: group2Width });
    } else if (groupHeight.includes(id)) {
      setPropModal({ dimension, newValue: num, group: groupHeight });
    }
    setEditing(null);
  };

  useEffect(() => {
    if (!editing) return;
    const handleKey = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitEdit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        abortEdit();
      } else if (/^\d$/.test(e.key)) {
        e.preventDefault();
        setEditing(st => ({ ...st, value: st.value + e.key }));
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        setEditing(st => ({ ...st, value: st.value.slice(0, -1) }));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [editing]);

  const confirmPropagation = () => {
    const { dimension, newValue, group } = propModal;
    setShapes(prev => applyReposition(prev.map(s => group.includes(s.id) ? { ...s, [dimension]: newValue } : s)));
    setPropModal(null);
  };

  const sortedShapes = [...shapes].sort((a, b) => a.order - b.order);

  return (
    <>
      <Stage width={1000} height={750} draggable ref={stageRef}>
        <Layer>
          {sortedShapes.map(shape => {
            const scaledWidth = shape.width * scaleFactor;
            const scaledHeight = shape.height * scaleFactor;
            const leftX = shape.x;
            const topY = shape.y;
            const rightX = leftX + scaledWidth;
            const bottomY = topY + scaledHeight;
            const isWEdit = editing?.id === shape.id && editing.dimension === 'width';
            const isHEdit = editing?.id === shape.id && editing.dimension === 'height';
            return (
              <Group key={shape.id}>
                {/* Номер и видимость */}
                <Text text={`#${shape.order}`} x={leftX + 5} y={topY - 20} fontSize={16} fill="black"/>
                <Text text={shape.visible ? 'X' : '👁'} x={rightX - 15} y={topY - 20} fontSize={18}
                      fill={shape.visible ? 'red' : 'green'}
                      onClick={() => toggleVisibility(shape.id)}
                      onMouseEnter={e => e.target.getStage().container().style.cursor = 'pointer'}
                      onMouseLeave={e => e.target.getStage().container().style.cursor = 'default'}
                />

                {shape.visible && (
                  <>
                    <Rect
                      x={leftX} y={topY}
                      width={scaledWidth} height={scaledHeight}
                      fill={shape.color} stroke="#000" strokeWidth={1} cornerRadius={2}
                      onDblClick={() => {
                        const [roomId] = shape.id.split('-');
                        navigate(
                          `/project/${projectId}/staircase/${staircaseId}/apartment/${apartmentId}/room/${roomId}/wall/${shape.id}`,
                        );
                      }}
                      onMouseEnter={e => e.target.getStage().container().style.cursor = 'pointer'}
                      onMouseLeave={e => e.target.getStage().container().style.cursor = 'default'}
                    />

                    <Text text={shape.name} x={leftX} y={topY + scaledHeight / 2 - 10}
                          width={scaledWidth} align="center" fontSize={16} fill="#fff"
                    />

                    {/* Ширина и высота */}
                    <Arrow points={[leftX, bottomY + 20, rightX, bottomY + 20]} stroke="red" fill="red" pointerWidth={6}
                           pointerLength={6}/>
                    <Text
                      text={isWEdit ? `${editing.value}|` : `${shape.width}`}
                      x={leftX} y={bottomY + 5} width={scaledWidth} align="center" fontSize={14}
                      fill="#333" onClick={() => startEdit(shape, 'width')}
                    />

                    <Arrow points={[leftX - 20, topY, leftX - 20, bottomY]} stroke="blue" fill="blue" pointerWidth={6}
                           pointerLength={6}/>
                    <Text
                      text={isHEdit ? `${editing.value}|` : `${shape.height}`}
                      x={leftX - 40} y={topY + scaledHeight / 2 + 75}
                      width={90} align="right" fontSize={14} fill="#333" rotation={-90}
                      onClick={() => startEdit(shape, 'height')}
                    />
                  </>
                )}
              </Group>
            );
          })}
        </Layer>
      </Stage>

      {propModal && (
        <WallsConfirmModal
          isOpen={true}
          group={propModal.group}
          shapes={shapes}
          dimension={propModal.dimension}
          onConfirm={confirmPropagation}
          onCancel={() => setPropModal(null)}
        />
      )}
    </>
  );
};

export default WallsConfiguration;
