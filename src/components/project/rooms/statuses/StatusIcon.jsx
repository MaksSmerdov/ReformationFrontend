const StatusIcon = ({ status, statusColor, className }) => {
	return (
		<div className={`square-element border border-1 border-dark h-100 text-center align-content-center fw-bold lh-1 position-relative bg-white user-select-none status-index-${status.index_style} ${className}`} style={{ '--group-color': statusColor }}>
			<div className="position-absolute w-100 h-100 top-0 status-background"></div>
			<div className="position-relative status-acronym lh-1">{status.acronym}</div>
		</div>
	);
};

export default StatusIcon;
