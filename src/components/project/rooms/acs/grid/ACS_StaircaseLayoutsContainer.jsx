import React from 'react';
import ACS_StaircaseLayoutCell from '@components/project/rooms/acs/grid/ACS_StaircaseLayoutCell';

const ACS_StaircaseLayoutsContainer = ({ staircaseLayoutObjects, handleSelectColumn }) => {
	return (
		<>
			{staircaseLayoutObjects.map((layoutObject) => (
				<ACS_StaircaseLayoutCell key={layoutObject.id} xCoordinate={layoutObject.x_coordinate} layoutObject={layoutObject} handleSelectColumn={handleSelectColumn} />
			))}
		</>
	);
};

export default ACS_StaircaseLayoutsContainer;
