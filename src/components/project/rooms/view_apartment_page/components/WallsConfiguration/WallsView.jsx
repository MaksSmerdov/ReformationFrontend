import React, { useState } from 'react';
import WallsTable from '@components/project/rooms/view_apartment_page/components/WallsConfiguration/WallsTable.jsx';
import WallsConfiguration
  from '@components/project/rooms/view_apartment_page/components/WallsConfiguration/WallsConfiguration.jsx';

const initialShapes = [
  {
    id: 'seinaA',
    order: 1,
    name: 'SEINÄ A',
    width: 6000,
    height: 3200,
    color: '#a0522d',
    x: 80,
    y: 300,
    visible: true,
    description: '',
  },
  {
    id: 'seinaB',
    order: 2,
    name: 'SEINÄ B',
    width: 2200,
    height: 3200,
    color: '#b5651d',
    x: 405,
    y: 300,
    visible: true,
    description: '',
  },
  {
    id: 'seinaC',
    order: 3,
    name: 'SEINÄ C',
    width: 6000,
    height: 3200,
    color: '#ff9999',
    x: 560,
    y: 300,
    visible: true,
    description: '',
  },
  {
    id: 'seinaD',
    order: 4,
    name: 'SEINÄ D',
    width: 2200,
    height: 3200,
    color: '#87cefa',
    x: 885,
    y: 300,
    visible: true,
    description: '',
  },
  {
    id: 'kattoK',
    order: 5,
    name: 'KATTO',
    width: 6000,
    height: 3200,
    color: '#d9d9d9',
    x: 560,
    y: 100,
    visible: true,
    description: '',
  },
  {
    id: 'lattiaL',
    order: 6,
    name: 'LATTIA',
    width: 6000,
    height: 3200,
    color: '#555',
    x: 560,
    y: 500,
    visible: true,
    description: '',
  },
];

const WallsView = () => {
  const [shapes, setShapes] = useState(initialShapes);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
      <WallsTable shapes={shapes} onShapesChange={setShapes}/>
      <WallsConfiguration shapes={shapes} setShapes={setShapes}/>
    </div>
  );
};

export default WallsView;
