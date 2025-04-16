export const getDefaultWalls = (roomId) => [
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

export const cloneAndRetagWalls = (roomId, walls) =>
  walls.map(w => ({ ...w, id: `${roomId}-${w.id.split('-')[1] || w.id}` }));

export const createRoom = (id, name, x, y, baseWalls = null) => ({
  id,
  name,
  position: { x, y },
  walls: baseWalls ? cloneAndRetagWalls(id, baseWalls) : getDefaultWalls(id),
  collapsed: false,
});
