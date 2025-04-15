// RoomsConfiguration.jsx
import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Circle, Group } from 'react-konva';
import WallsView from '@components/project/rooms/view_apartment_page/components/WallsConfiguration/WallsView.jsx';
import styles from './RoomsConfiguration.module.scss';
import CustomButton from '@components/project/rooms/view_apartment_page/ui/CustomButton/CustomButton.jsx';

// Коэффициент масштабирования (мм -> px)
const roomScale = 0.045;
// Радиус «+»-кнопки
const plusButtonRadius = 10;
// Отступ «+»-кнопки от края
const plusButtonGap = 5;

// Создаём стены комнаты. Если передан baseWalls, копируем их параметры (кроме id).
const getDefaultWalls = (roomId, baseWalls) => {
  if (baseWalls) {
    return baseWalls.map(wall => ({
      ...wall,
      id: `${roomId}-${wall.id.split('-')[1] || wall.id}`,
    }));
  }
  return [
    {
      id: `${roomId}-A`,
      order: 1,
      name: 'Стена A',
      width: 6000,
      height: 3200,
      color: '#a0522d',
      visible: true,
      description: '',
    },
    {
      id: `${roomId}-B`,
      order: 2,
      name: 'Стена B',
      width: 2200,
      height: 3200,
      color: '#b5651d',
      visible: true,
      description: '',
    },
    {
      id: `${roomId}-C`,
      order: 3,
      name: 'Стена C',
      width: 6000,
      height: 3200,
      color: '#ff9999',
      visible: true,
      description: '',
    },
    {
      id: `${roomId}-D`,
      order: 4,
      name: 'Стена D',
      width: 2200,
      height: 3200,
      color: '#87cefa',
      visible: true,
      description: '',
    },
    {
      id: `${roomId}-K`,
      order: 5,
      name: 'Крыша',
      width: 6000,
      height: 3200,
      color: '#d9d9d9',
      visible: true,
      description: '',
    },
    {
      id: `${roomId}-L`,
      order: 6,
      name: 'Пол',
      width: 6000,
      height: 3200,
      color: '#555',
      visible: true,
      description: '',
    },
  ];
};

// Возвращает (overallWidth, overallHeight) комнаты, исходя из стен
const calculateRoomDimensions = (walls) => {
  const wallA = walls.find(w => w.id.endsWith('-A'));
  const wallB = walls.find(w => w.id.endsWith('-B'));
  const wallC = walls.find(w => w.id.endsWith('-C'));
  const wallD = walls.find(w => w.id.endsWith('-D'));
  const wallL = walls.find(w => w.id.endsWith('-L'));

  const overallWidth = wallL ? wallL.width : 0;
  const overallHeight = Math.max(
    wallA?.height || 0,
    wallB?.height || 0,
    wallC?.height || 0,
    wallD?.height || 0,
  );
  return { overallWidth, overallHeight };
};

const shouldRenderPlusButton = (room, direction, allRooms) => {
  const tolerance = 25;
  const { overallWidth, overallHeight } = calculateRoomDimensions(room.walls);
  const roomWidthPx = overallWidth * roomScale;
  const roomHeightPx = overallHeight * roomScale;

  const roomLeft = room.x;
  const roomRight = room.x + roomWidthPx;
  const roomTop = room.y;
  const roomBottom = room.y + roomHeightPx;

  for (const other of allRooms) {
    if (other.id === room.id) continue;
    const { overallWidth: ow2, overallHeight: oh2 } = calculateRoomDimensions(other.walls);
    const otherWidthPx = ow2 * roomScale;
    const otherHeightPx = oh2 * roomScale;

    const otherLeft = other.x;
    const otherRight = other.x + otherWidthPx;
    const otherTop = other.y;
    const otherBottom = other.y + otherHeightPx;

    if (direction === 'right') {
      const horizontallyAdjacent = Math.abs(roomRight - otherLeft) < tolerance;
      const verticallyOverlap = !(otherTop >= roomBottom || otherBottom <= roomTop);
      if (horizontallyAdjacent && verticallyOverlap) return false;
    }
    if (direction === 'left') {
      const horizontallyAdjacent = Math.abs(roomLeft - otherRight) < tolerance;
      const verticallyOverlap = !(otherTop >= roomBottom || otherBottom <= roomTop);
      if (horizontallyAdjacent && verticallyOverlap) return false;
    }
    if (direction === 'up') {
      const verticallyAdjacent = Math.abs(roomTop - otherBottom) < tolerance;
      const horizontallyOverlap = !(otherLeft >= roomRight || otherRight <= roomLeft);
      if (verticallyAdjacent && horizontallyOverlap) return false;
    }
    if (direction === 'down') {
      const verticallyAdjacent = Math.abs(roomBottom - otherTop) < tolerance;
      const horizontallyOverlap = !(otherLeft >= roomRight || otherRight <= roomLeft);
      if (verticallyAdjacent && horizontallyOverlap) return false;
    }
  }
  return true;
};

export default function RoomsConfiguration () {
  const [rooms, setRooms] = useState([
    {
      id: 'room1',
      name: 'Комната 1',
      walls: getDefaultWalls('room1'),
      x: 400,
      y: 325,
      collapsed: false,
    },
  ]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const addRoom = (parentRoomId, direction) => {
    const parentRoom = rooms.find(r => r.id === parentRoomId);
    if (!parentRoom) return;
    const { overallWidth, overallHeight } = calculateRoomDimensions(parentRoom.walls);
    const roomWidthPx = overallWidth * roomScale;
    const roomHeightPx = overallHeight * roomScale;
    let newX = parentRoom.x;
    let newY = parentRoom.y;

    switch (direction) {
      case 'right':
        newX += roomWidthPx + plusButtonRadius * 2;
        break;
      case 'left':
        newX -= (roomWidthPx + plusButtonRadius * 2);
        break;
      case 'up':
        newY -= (roomHeightPx + plusButtonRadius * 2);
        break;
      case 'down':
        newY += (roomHeightPx + plusButtonRadius * 2);
        break;
      default:
        break;
    }

    const newRoomId = `room${rooms.length + 1}`;
    const newRoom = {
      id: newRoomId,
      name: `Комната ${rooms.length + 1}`,
      walls: getDefaultWalls(newRoomId, parentRoom.walls),
      x: newX,
      y: newY,
      collapsed: false,
    };
    setRooms(prev => [...prev, newRoom]);
  };

  const handleRoomDoubleClick = (roomId) => {
    setSelectedRoomId(roomId);
  };

  const handleDeleteRoom = (roomId) => {
    setRooms(prev => {
      const updated = prev.filter(r => r.id !== roomId);
      if (selectedRoomId === roomId) setSelectedRoomId(null);
      return updated;
    });
  };

  const handleToggleCollapsed = (roomId) => {
    setRooms(rooms.map(r => {
      if (r.id !== roomId) return r;
      return { ...r, collapsed: !r.collapsed };
    }));
  };

  const renderPlusButton = (cx, cy, direction, parentRoomId, room) => {
    if (!shouldRenderPlusButton(room, direction, rooms)) {
      return null;
    }
    return (
      <Group
        x={cx}
        y={cy}
        onMouseEnter={e => { e.target.getStage().container().style.cursor = 'pointer'; }}
        onMouseLeave={e => { e.target.getStage().container().style.cursor = 'default'; }}
        onClick={(e) => {
          e.cancelBubble = true;
          addRoom(parentRoomId, direction);
        }}
      >
        <Circle radius={plusButtonRadius} fill="#fff" stroke="black" strokeWidth={1}/>
        <Text text="+" fontSize={16} offsetX={4} offsetY={6}/>
      </Group>
    );
  };

  const handleBackToRooms = () => {
    setSelectedRoomId(null);
  };

  if (!selectedRoomId) {
    return (
      <div className={styles['rooms-konva-container']} style={{ border: '1px solid grey' }}>
        <Stage width={1000} height={750} draggable>
          <Layer>
            {rooms.map(room => {
              const { overallWidth, overallHeight } = calculateRoomDimensions(room.walls);
              let roomWidthPx = overallWidth * roomScale;
              let roomHeightPx = overallHeight * roomScale;

              if (room.collapsed) {
                roomHeightPx = 1;
              }

              return (
                <Group key={room.id} x={room.x} y={room.y}>
                  <Rect
                    width={roomWidthPx}
                    height={roomHeightPx}
                    fill="#f0f0f0"
                    stroke="black"
                    strokeWidth={1}
                    onDblClick={() => handleRoomDoubleClick(room.id)}
                    onMouseEnter={e => { e.target.getStage().container().style.cursor = 'pointer'; }}
                    onMouseLeave={e => { e.target.getStage().container().style.cursor = 'default'; }}
                  />
                  {!room.collapsed && (
                    <Text
                      text={room.name}
                      fontSize={14}
                      fill="black"
                      // Поместим текст по центру прямоугольника
                      x={roomWidthPx / 2}
                      y={roomHeightPx / 2}
                      offsetX={room.name.length * 7 / 2} // Примерная ширина символа ~7px
                      offsetY={7} // Примерно половина высоты текста (14px -> 7)
                      onDblClick={() => handleRoomDoubleClick(room.id)}
                      onMouseEnter={e => { e.target.getStage().container().style.cursor = 'pointer'; }}
                      onMouseLeave={e => { e.target.getStage().container().style.cursor = 'default'; }}
                    />
                  )}

                  <Text
                    text="✕"
                    fontSize={16}
                    fill="red"
                    x={2}
                    y={-20}
                    onMouseEnter={e => { e.target.getStage().container().style.cursor = 'pointer'; }}
                    onMouseLeave={e => { e.target.getStage().container().style.cursor = 'default'; }}
                    onClick={(e) => {
                      e.cancelBubble = true;
                      handleDeleteRoom(room.id);
                    }}
                  />

                  <Text
                    text={room.collapsed ? '🙈' : '👁'}
                    fontSize={16}
                    fill="blue"
                    x={roomWidthPx - 22}
                    y={-20}
                    onMouseEnter={e => { e.target.getStage().container().style.cursor = 'pointer'; }}
                    onMouseLeave={e => { e.target.getStage().container().style.cursor = 'default'; }}
                    onClick={(e) => {
                      e.cancelBubble = true;
                      handleToggleCollapsed(room.id);
                    }}
                  />

                  {!room.collapsed && (
                    <>
                      {renderPlusButton(roomWidthPx / 2, -plusButtonRadius - plusButtonGap, 'up', room.id, room)}
                      {renderPlusButton(roomWidthPx / 2, roomHeightPx + plusButtonRadius + plusButtonGap, 'down',
                        room.id, room)}
                      {renderPlusButton(-plusButtonRadius - plusButtonGap, roomHeightPx / 2, 'left', room.id, room)}
                      {renderPlusButton(roomWidthPx + plusButtonRadius + plusButtonGap, roomHeightPx / 2, 'right',
                        room.id, room)}
                    </>
                  )}
                </Group>
              );
            })}
          </Layer>
        </Stage>
      </div>
    );
  }

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);
  if (!selectedRoom) {
    return <CustomButton onClick={handleBackToRooms}>Вернуться к комнатам</CustomButton>;
  }

  return (
    <div className={styles['walls-view-container']}>
      <h3>{selectedRoom.name}</h3>
      <CustomButton onClick={handleBackToRooms} style={{ marginBottom: '1rem' }}>
        Вернуться к комнатам
      </CustomButton>
      <WallsView
        shapes={selectedRoom.walls}
        setShapes={(newWalls) => {
          setRooms(rooms.map(r => r.id === selectedRoomId ? { ...r, walls: newWalls } : r));
        }}
      />
    </div>
  );
}
