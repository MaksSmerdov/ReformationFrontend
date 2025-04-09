import React from 'react';
import ACS_StaircaseFloorCell from '@components/project/rooms/acs/grid/ACS_StaircaseFloorCell';

const ACS_StaircaseFloorsContainer = ({ floors, handleSelectRow }) => {
	return (
		<>
			{floors.map((floor) => (
				<ACS_StaircaseFloorCell key={floor} yCoordinate={floor} handleSelectRow={handleSelectRow} />
			))}
		</>
	);
};

export default ACS_StaircaseFloorsContainer;
