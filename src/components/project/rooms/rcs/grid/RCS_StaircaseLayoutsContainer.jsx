import React from 'react';
import RCS_StaircaseLayoutCell from '@components/project/rooms/rcs/grid/RCS_StaircaseLayoutCell';

const RCS_StaircaseLayoutsContainer = ({ staircaseLayoutObjects, handleSelectColumn }) => {
	return (
		<>
			{staircaseLayoutObjects.map((layoutObject) => (
				<RCS_StaircaseLayoutCell key={layoutObject.id} xCoordinate={layoutObject.x_coordinate} layoutObject={layoutObject} handleSelectColumn={handleSelectColumn} />
			))}
		</>
	);
};

export default RCS_StaircaseLayoutsContainer;
