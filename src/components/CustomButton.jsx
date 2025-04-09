import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomButton = ({ label, onClick }) => {
	return (
		<Button onClick={onClick} className="btn-primary btn-lg">
			{label}
		</Button>
	);
};

CustomButton.propTypes = {
	label: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired
};

export default CustomButton;
