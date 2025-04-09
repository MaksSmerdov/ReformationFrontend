import React from 'react';
import { Form } from 'react-bootstrap';
import ErrorBoundary from '@components/common/ErrorBoundary';

const ElementTicketsTab = () => {
	return (
		<ErrorBoundary>
			<Form className="p-2">
				No tickets available for selected elements.
				{/* <div className="tickets-list">
					{tickets.map((ticket) => (
						<div key={ticket.id} className="ticket-item">
							{ticket.name}
						</div>
					))}
				</div> */}
			</Form>
		</ErrorBoundary>
	);
};

export default ElementTicketsTab;
