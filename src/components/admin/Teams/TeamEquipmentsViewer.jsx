import React from 'react';
import { Card } from 'react-bootstrap';

const TeamEquipmentsViewer = ({ equipments, className, ...props }) => {
	if (!Array.isArray(equipments) || equipments.length === 0) {
		return null;
	}

	return (
		<table className={`table table-bordered m-0 ${className}`} {...props}>
			<tbody>
				{equipments.map((equipment, index) => (
					<tr key={index}>
						<td className="bg-transparent">{equipment.equipment.model}</td>
						<td className="bg-transparent">{equipment.equipment.name}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default React.memo(TeamEquipmentsViewer);
