import React, { Component } from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { ExclamationCircle } from 'react-bootstrap-icons';
import IconButton from '@components/common/icon/IconButton';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		this.setState({ error, errorInfo });
	}

	render() {
		if (this.state.hasError) {
			const popover = (
				<Popover id="error-popover" className="max-w-fit-content lh-1">
					<Popover.Body className="p-0 overflow-hidden">
						<div className="p-2px w-100 h-100 overflow-auto" style={{ maxWidth: '400px', maxHeight: '400px' }}>
							<div>{this.state.error && this.state.error.toString()}</div>
							<div className="white-space-pre-line w-max-content">{this.state.errorInfo && this.state.errorInfo.componentStack}</div>
						</div>
					</Popover.Body>
				</Popover>
			);

			return (
				<OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
					<IconButton icon={ExclamationCircle} variant="outline-danger" className="d-flex align-items-center rounded-0 border-2 border-dotted" />
				</OverlayTrigger>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
