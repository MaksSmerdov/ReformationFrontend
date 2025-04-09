import Select from 'react-select';

const customStylesDefault = {
	control: (provided) => ({
		...provided,
		minHeight: 'auto',
    height: '100%',
    backgroundColor: '',
    padding: 0,
    margin: 0,
    alignItems: 'center',
    display: 'flex',
	}),
	option: (provided) => ({
		...provided,
		padding: '2px'
	}),
	singleValue: (provided) => ({
		...provided,
		minWidth: 'max-content',
		padding: '0',
		margin: '0'
	}),
	input: (provided) => ({
		...provided,
		padding: 0,
		margin: 0
	}),

	valueContainer: (provided) => ({
		...provided,
		gap: '2px',
		padding: '2px'
	}),
	multiValue: (provided) => ({
		...provided,
		borderRadius: '3px',
		margin: '0',
		border: '1px solid #ced4da',
		backgroundColor: ''
	}),
	multiValueLabel: (provided) => ({
		...provided,
		padding: '2px',
		paddingLeft: undefined,
		color: ''
	}),
	multiValueRemove: (provided) => ({
		...provided,
		padding: '2px',
		borderLeft: '1px solid #ced4da',
		borderRadius: '0 3px 3px 0'
	}),

	indicatorsContainer: (provided) => ({
		...provided
	}),
	clearIndicator: (provided) => ({
		...provided,
		padding: 0,
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		borderLeft: '1px solid #ced4da'
	}),
	indicatorSeparator: (provided) => ({
		...provided,
		marginBottom: 0,
		marginTop: 0
	}),
	dropdownIndicator: (provided) => ({
		...provided,
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		padding: 0
	}),

	menuPortal: (provided) => ({
		...provided,
		zIndex: 2000
	}),
	menu: (provided) => ({
		...provided,
		backgroundColor: 'var(--bs-body-bg)',
		width: 'max-content',
		padding: '2px',
		marginTop: '1px',
		marginBottom: '1px'
	}),
	menuList: (provided) => ({
		...provided,
		padding: 0
	}),

	group: (provided) => ({
		...provided,
		paddingBlock: '2px',
		fontSize: '1rem',
		lineHeight: '1'
	}),
	groupHeading: (provided) => ({
		...provided,
		padding: '2px',
		fontSize: '1rem',
		lineHeight: '1',
		textDecoration: 'underline'
	})
};

const CustomSelect = ({ customStyles = {}, ...props }) => {
	const mergedStyles = {
		...customStylesDefault,
		...customStyles
	};

	return <Select {...props} styles={mergedStyles} menuPortalTarget={document.body} menuPosition="absolute" classNamePrefix="CS" />;
};

export default CustomSelect;
