import React, { useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import IconLink from '@components/common/icon/IconLink';
import { ArrowsFullscreen } from 'react-bootstrap-icons';

const FacadeDetails = ({ elements, facadeId }) => {
	const navigate = useNavigate();
	const { projectId } = useParams();

	const handleViewFacadeHref = useMemo(() => `/project/${projectId}/facade/${facadeId}`, [projectId, facadeId]);

	const { maxX, maxY, facadeM2 } = useMemo(() => {
		if (elements.length === 0) {
			return { maxX: 0, maxY: 0 };
		}
		const maxX_massive = elements.map((el) => el.left + el.width);
		const maxY_massive = elements.map((el) => el.bottom + el.height);
		const maxX = Math.max(...maxX_massive);
		const maxY = Math.max(...maxY_massive);
		const facadeM2 = ((maxX * maxY) / 1000000).toFixed(2);
		return { maxX, maxY, facadeM2 };
	}, [elements]);

	const elementsTable = useMemo(() => {
		const sizeMap = new Map();

		elements.forEach((el) => {
			const width = el.width;
			const height = el.height;
			const area = (width * height) / 1000000;
			const type = el.type.title;
			const key = `${type}`;

			if (sizeMap.has(key)) {
				sizeMap.get(key).count += 1;
				sizeMap.get(key).area += area;
			} else {
				sizeMap.set(key, { type, area, count: 1 });
			}
		});

		return Array.from(sizeMap.values().filter((el) => el.area > 0));
	}, [elements]);

	const elementsTableResult = useMemo(() => {
		return {
			area: elementsTable.reduce((acc, el) => acc + el.area, 0),
			count: elementsTable.reduce((acc, el) => acc + el.count, 0)
		};
	}, [elementsTable]);

	return (
		<div className="lh-1 d-flex flex-column justify-content-center align-items-center gap-1">
			<div className="w-fill-available d-flex flex-row justify-content-between align-items-center gap-1">
				<div className="d-flex flex-column justify-content-center align-items-start gap-1">
					<div>Leveys: {maxX} mm</div>
					<div>Korkeus: {maxY} mm</div>
					<div>Julkisivualue: {facadeM2} m2</div>
				</div>
				<IconLink icon={ArrowsFullscreen} href={handleViewFacadeHref} className="wh-resize-button" variant="outline-primary" target="_self" />
			</div>
			<div className="border border-1 border-dark">
				<table className="table table-bordered table-striped table-sm table-hover table-responsive mb-0">
					<thead>
						<tr>
							<th colSpan="3" className="">
								Julkisivuelementit
							</th>
						</tr>
						<tr>
							<th>Elemetti</th>
							<th>Alue (m2)</th>
							<th>Määrä</th>
						</tr>
					</thead>
					<tbody>
						{elementsTable.map((el, index) => (
							<tr key={index}>
								<td>{el.type}</td>
								<td>{el.area.toFixed(2)}</td>
								<td>{el.count}</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr className="table-active">
							<th>Yhteensä:</th>
							<th>{elementsTableResult.area.toFixed(2)}</th>
							<th>{elementsTableResult.count}</th>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	);
};

export default FacadeDetails;
