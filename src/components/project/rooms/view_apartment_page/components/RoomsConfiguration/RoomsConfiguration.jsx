import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Circle, Group } from 'react-konva';
import WallsView from '@components/project/rooms/view_apartment_page/components/WallsConfiguration/WallsView.jsx';
import CustomButton from '@components/project/rooms/view_apartment_page/ui/CustomButton/CustomButton.jsx';
import { createRoom } from './roomConfig';
import { getRoomMetrics } from './roomMetrics';
import styles from './RoomsConfiguration.module.scss';

const roomScale = 0.045;
const plusButtonRadius = 10;
const plusButtonGap = 5;
const roomGap = 60;
const tolerance = roomGap + 25;

const shouldRenderPlusButton = (room, dir, rooms) => {
  const m = getRoomMetrics(room.walls);
  const rw = m.width * roomScale;
  const rh = m.height * roomScale;
  const { x, y } = room.position;
  const box1 = { l: x, r: x + rw, t: y, b: y + rh };

  return !rooms.some(o => {
    if (o.id === room.id) return false;
    const om = getRoomMetrics(o.walls);
    const ow = om.width * roomScale;
    const oh = om.height * roomScale;
    const box2 = { l: o.position.x, r: o.position.x + ow, t: o.position.y, b: o.position.y + oh };

    switch (dir) {
      case 'right':
        return Math.abs(box1.r - box2.l) < tolerance && !(box2.t >= box1.b || box2.b <= box1.t);
      case 'left':
        return Math.abs(box1.l - box2.r) < tolerance && !(box2.t >= box1.b || box2.b <= box1.t);
      case 'up':
        return Math.abs(box1.t - box2.b) < tolerance && !(box2.l >= box1.r || box2.r <= box1.l);
      case 'down':
        return Math.abs(box1.b - box2.t) < tolerance && !(box2.l >= box1.r || box2.r <= box1.l);
      default:
        return false;
    }
  });
};

export default function RoomsConfiguration () {
  const [rooms, setRooms] = useState(() => {
    const initial = createRoom('room1', 'Комната 1', 0, 0);
    const m = getRoomMetrics(initial.walls);
    const rw = m.width * roomScale;
    const rh = m.height * roomScale;
    initial.position = {
      x: 1200 / 2 - rw / 2,
      y: innerHeight / 2 - rh / 2,
    };
    return [initial];
  });

  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [editingName, setEditingName] = useState(null);

  const getNextRoomIndex = () => {
    const used = rooms.map(r => parseInt(r.id.replace(/^room/, ''), 10)).filter(n => !isNaN(n));
    let i = 1;
    while (used.includes(i)) i++;
    return i;
  };

  const addRoom = (parentId, dir) => {
    const parent = rooms.find(r => r.id === parentId);
    if (!parent) return;

    const pm = getRoomMetrics(parent.walls);
    const pw = pm.width * roomScale;
    const ph = pm.height * roomScale;
    let nx = parent.position.x;
    let ny = parent.position.y;

    switch (dir) {
      case 'right':
        nx += pw + roomGap;
        break;
      case 'left':
        nx -= pw + roomGap;
        break;
      case 'up':
        ny -= ph + roomGap;
        break;
      case 'down':
        ny += ph + roomGap;
        break;
    }

    const idx = getNextRoomIndex();
    const newRoom = createRoom(
      `room${idx}`,
      `Комната ${idx}`,
      nx,
      ny,
      JSON.parse(JSON.stringify(parent.walls)),
    );

    setRooms(prev => [...prev, newRoom]);
  };

  const deleteRoom = roomId => {
    setRooms(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.filter(r => r.id !== roomId);
      if (selectedRoomId === roomId) setSelectedRoomId(null);
      return next;
    });
  };

  const toggleCollapsed = roomId =>
    setRooms(prev =>
      prev.map(r => (r.id === roomId ? { ...r, collapsed: !r.collapsed } : r)),
    );

  const backToRooms = () => setSelectedRoomId(null);

  const renderPlus = (cx, cy, dir, parentId, room) =>
    shouldRenderPlusButton(room, dir, rooms) && (
      <Group
        x={cx}
        y={cy}
        onMouseEnter={e => (e.target.getStage().container().style.cursor = 'pointer')}
        onMouseLeave={e => (e.target.getStage().container().style.cursor = 'default')}
        onClick={e => {
          e.cancelBubble = true;
          addRoom(parentId, dir);
        }}
      >
        <Circle radius={plusButtonRadius} fill="#fff" stroke="#000" strokeWidth={1}/>
        <Text text="+" fontSize={16} offsetX={4} offsetY={6}/>
      </Group>
    );

  if (!selectedRoomId) {
    return (
      <div className={styles['rooms-konva-container']} style={{ border: '1px solid grey' }}>
        <Stage width={1200} height={innerHeight} draggable>
          <Layer>
            {rooms.map(room => {
              const { id, name, position, walls, collapsed } = room;
              const m = getRoomMetrics(walls);
              let rwpx = m.width * roomScale;
              let rhpx = m.height * roomScale;
              if (collapsed) rhpx = 1;

              return (
                <Group key={id} x={position.x} y={position.y}>
                  {/* тело комнаты */}
                  <Rect
                    width={rwpx}
                    height={rhpx}
                    fill="#f0f0f0"
                    stroke="#000"
                    strokeWidth={1}
                    onDblClick={() => setSelectedRoomId(id)}
                    onMouseEnter={e => (e.target.getStage().container().style.cursor = 'pointer')}
                    onMouseLeave={e => (e.target.getStage().container().style.cursor = 'default')}
                  />

                  {/* название */}
                  {!collapsed && (
                    <Text
                      text={name}
                      fontSize={14}
                      x={rwpx / 2}
                      y={rhpx / 2}
                      offsetX={(name.length * 7) / 2}
                      offsetY={7}
                      onMouseEnter={e => (e.target.getStage().container().style.cursor = 'pointer')}
                      onMouseLeave={e => (e.target.getStage().container().style.cursor = 'default')}
                    />
                  )}

                  {/* кнопка удаления */}
                  {!collapsed && rooms.length > 1 && (
                    <Text
                      text="✕"
                      fontSize={16}
                      fill="red"
                      x={4}
                      y={-20}
                      onMouseEnter={e => (e.target.getStage().container().style.cursor = 'pointer')}
                      onMouseLeave={e => (e.target.getStage().container().style.cursor = 'default')}
                      onClick={e => {
                        e.cancelBubble = true;
                        deleteRoom(id);
                      }}
                    />
                  )}

                  {/* иконка редактирования */}
                  {!collapsed && (
                    <Text
                      text="✏️"
                      fontSize={14}
                      x={rwpx - 44}
                      y={-20}
                      onMouseEnter={e => (e.target.getStage().container().style.cursor = 'pointer')}
                      onMouseLeave={e => (e.target.getStage().container().style.cursor = 'default')}
                      onClick={e => {
                        e.cancelBubble = true;
                        const stage = e.target.getStage();
                        const container = stage.container().getBoundingClientRect();
                        const groupPos = e.target.getParent().getAbsolutePosition();
                        setEditingName({
                          roomId: id,
                          value: name,
                          x: container.left + groupPos.x + rwpx / 2 - 50,
                          y: container.top + groupPos.y + rhpx / 2 - 10,
                        });
                      }}
                    />
                  )}

                  {/* иконка видимости */}
                  <Text
                    text={collapsed ? 'X' : '👁'}
                    fontSize={16}
                    fill="blue"
                    x={rwpx - 22}
                    y={-20}
                    onMouseEnter={e => (e.target.getStage().container().style.cursor = 'pointer')}
                    onMouseLeave={e => (e.target.getStage().container().style.cursor = 'default')}
                    onClick={e => {
                      e.cancelBubble = true;
                      toggleCollapsed(id);
                    }}
                  />

                  {/* плюсы для добавления соседних комнат */}
                  {!collapsed && (
                    <>
                      {renderPlus(rwpx / 2, -plusButtonRadius - plusButtonGap, 'up', id, room)}
                      {renderPlus(rwpx / 2, rhpx + plusButtonRadius + plusButtonGap, 'down', id, room)}
                      {renderPlus(-plusButtonRadius - plusButtonGap, rhpx / 2, 'left', id, room)}
                      {renderPlus(rwpx + plusButtonRadius + plusButtonGap, rhpx / 2, 'right', id, room)}
                    </>
                  )}

                  {!collapsed && (
                    <>
                      <Text
                        text={`Площадь: ${m.areaM2.toFixed(1)} м²`}
                        fontSize={14}
                        fill="#555"
                        x={4}
                        y={rhpx - 35}
                      />
                      <Text
                        text={`Ш: ${m.width} мм,  В: ${m.height} мм`}
                        fontSize={14}
                        fill="#555"
                        x={4}
                        y={rhpx - 15}
                      />
                    </>
                  )}
                </Group>
              );
            })}
          </Layer>
        </Stage>

        {editingName && (
          <input
            className={styles['rooms-name-input']}
            style={{
              position: 'fixed',
              top: editingName.y,
              left: editingName.x,
              width: 100,
            }}
            value={editingName.value}
            onChange={e => setEditingName({ ...editingName, value: e.target.value })}
            onBlur={() => {
              setRooms(prev =>
                prev.map(r =>
                  r.id === editingName.roomId
                    ? { ...r, name: editingName.value }
                    : r,
                ),
              );
              setEditingName(null);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') e.target.blur();
              if (e.key === 'Escape') setEditingName(null);
            }}
            autoFocus
          />
        )}
      </div>
    );
  }

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);
  if (!selectedRoom) return null;

  return (
    <div className={styles['walls-view-container']}>
      <h3>{selectedRoom.name}</h3>
      <CustomButton onClick={backToRooms} style={{ marginBottom: '1rem' }}>
        Вернуться к комнатам
      </CustomButton>
      <WallsView
        shapes={selectedRoom.walls}
        setShapes={newWalls =>
          setRooms(prev =>
            prev.map(r => (r.id === selectedRoomId ? { ...r, walls: newWalls } : r)),
          )
        }
      />
    </div>
  );
}
