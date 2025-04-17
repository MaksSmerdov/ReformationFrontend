import { useState, useRef } from 'react';
import { Stage, Layer, Rect, Text, Arrow, Group } from 'react-konva';
import WallsConfirmModal
  from '@components/project/rooms/view_apartment_page/components/WallsConfiguration/WallsConfirmModal.jsx';

const scaleFactor = 0.045;

const WallsConfiguration = ({ shapes, setShapes }) => {
  const [editing, setEditing] = useState(null);
  const [propagateModal, setPropagateModal] = useState(null);
  const containerRef = useRef(null);

  const group1Width = ['seinaA', 'seinaC', 'kattoK', 'lattiaL'];
  const group2Width = ['seinaB', 'seinaD'];
  const groupHeight = ['seinaA', 'seinaB', 'seinaC', 'seinaD', 'kattoK', 'lattiaL'];

  const toggleVisibility = (id) => {
    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === id ? { ...shape, visible: !shape.visible } : shape,
      ),
    );
  };

  const commitEdit = () => {
    if (!editing) return;
    const { id, dimension, value } = editing;
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      alert('Некорректное значение!');
      return;
    }
    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === id ? { ...shape, [dimension]: numericValue } : shape,
      ),
    );

    if (dimension === 'width') {
      if (group1Width.includes(id)) {
        setPropagateModal({
          dimension,
          newValue: numericValue,
          group: group1Width,
        });
      } else if (group2Width.includes(id)) {
        setPropagateModal({
          dimension,
          newValue: numericValue,
          group: group2Width,
        });
      }
    } else if (dimension === 'height') {
      if (groupHeight.includes(id)) {
        setPropagateModal({
          dimension,
          newValue: numericValue,
          group: groupHeight,
        });
      }
    }
    setEditing(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      commitEdit();
    } else if (e.key === 'Escape') {
      setEditing(null);
    }
  };

  const handlePropagateYes = () => {
    const { dimension, newValue, group } = propagateModal;
    setShapes((prev) =>
      prev.map((shape) =>
        group.includes(shape.id) ? { ...shape, [dimension]: newValue } : shape,
      ),
    );
    setPropagateModal(null);
  };

  const handlePropagateNo = () => {
    setPropagateModal(null);
  };

  const sortedShapes = [...shapes].sort((a, b) => a.order - b.order);

  return (
    <div style={{ position: 'relative' }} ref={containerRef}>
      <Stage width={1000} height={750}>
        <Layer>
          {sortedShapes.map((shape) => {
            const scaledWidth = shape.width * scaleFactor;
            const scaledHeight = shape.height * scaleFactor;
            const leftX = shape.x;
            const topY = shape.y;
            const rightX = leftX + scaledWidth;
            const bottomY = topY + scaledHeight;
            return (
              <Group key={shape.id}>
                <Text
                  text={`#${shape.order}`}
                  x={leftX + 5}
                  y={topY - 20}
                  fontSize={16}
                  fill="black"
                />
                <Text
                  text={shape.visible ? 'X' : '👁'}
                  x={rightX - 15}
                  y={topY - 20}
                  fontSize={18}
                  fill={shape.visible ? 'red' : 'green'}
                  onClick={() => toggleVisibility(shape.id)}
                  onMouseEnter={(e) => {
                    e.target.getStage().container().style.cursor = 'pointer';
                  }}
                  onMouseLeave={(e) => {
                    e.target.getStage().container().style.cursor = 'default';
                  }}
                />
                {shape.visible && (
                  <>
                    <Rect
                      x={leftX}
                      y={topY}
                      width={scaledWidth}
                      height={scaledHeight}
                      fill={shape.color}
                      stroke="#000"
                      strokeWidth={1}
                      cornerRadius={2}
                    />
                    <Text
                      text={shape.name}
                      x={leftX}
                      y={topY + scaledHeight / 2 - 10}
                      width={scaledWidth}
                      align="center"
                      fontSize={16}
                      fill="#fff"
                    />
                    <Arrow
                      points={[leftX, bottomY + 20, rightX, bottomY + 20]}
                      stroke="red"
                      fill="red"
                      pointerWidth={6}
                      pointerLength={6}
                    />
                    <Text
                      text={`${shape.width}`}
                      x={leftX}
                      y={bottomY + 5}
                      width={scaledWidth}
                      align="center"
                      fontSize={14}
                      fill="#333"
                      onClick={() =>
                        setEditing({
                          id: shape.id,
                          dimension: 'width',
                          value: shape.width,
                          x: leftX + scaledWidth / 2 - 30,
                          y: bottomY + 5,
                        })
                      }
                      onMouseEnter={(e) =>
                        (e.target.getStage().container().style.cursor = 'pointer')
                      }
                      onMouseLeave={(e) =>
                        (e.target.getStage().container().style.cursor = 'default')
                      }
                    />
                    <Arrow
                      points={[leftX - 20, topY, leftX - 20, bottomY]}
                      stroke="blue"
                      fill="blue"
                      pointerWidth={6}
                      pointerLength={6}
                    />
                    <Text
                      text={`${shape.height}`}
                      x={leftX - 40}
                      y={topY + scaledHeight / 2 + 75}
                      width={90}
                      align="right"
                      fontSize={14}
                      fill="#333"
                      rotation={-90}
                      onClick={() =>
                        setEditing({
                          id: shape.id,
                          dimension: 'height',
                          value: shape.height,
                          x: leftX - 60,
                          y: topY + scaledHeight / 2 - 10,
                        })
                      }
                      onMouseEnter={(e) =>
                        (e.target.getStage().container().style.cursor = 'pointer')
                      }
                      onMouseLeave={(e) =>
                        (e.target.getStage().container().style.cursor = 'default')
                      }
                    />
                  </>
                )}
              </Group>
            );
          })}
        </Layer>
      </Stage>
      {editing && (
        <input
          type="number"
          value={editing.value}
          onChange={(e) =>
            setEditing({ ...editing, value: e.target.value })
          }
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          style={{
            position: 'absolute',
            top: editing.y,
            left: editing.x,
            fontSize: '16px',
            padding: '4px',
            width: '75px',
            border: '1px solid #ccc',
            textAlign: 'center',
          }}
          autoFocus
        />
      )}
      {propagateModal && (
        <WallsConfirmModal
          isOpen={!!propagateModal}
          group={propagateModal.group}
          shapes={shapes}
          dimension={propagateModal.dimension}
          onConfirm={handlePropagateYes}
          onCancel={handlePropagateNo}
        />
      )}
    </div>
  );
};

export default WallsConfiguration;
