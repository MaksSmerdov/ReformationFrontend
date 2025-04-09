import React from 'react';
import RCS_StaircaseFloorCell from '@components/project/rooms/rcs/grid/RCS_StaircaseFloorCell';

const RCS_StaircaseFloorsContainer = ({ floors, handleSelectRow }) => {
	return (
		<>
			{floors.map((floor) => (
				<RCS_StaircaseFloorCell key={floor} yCoordinate={floor} handleSelectRow={handleSelectRow} />
			))}
		</>
	);
};

export default RCS_StaircaseFloorsContainer;
