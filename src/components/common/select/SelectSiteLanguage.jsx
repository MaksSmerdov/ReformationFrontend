import { useEffect, useState } from 'react';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import CustomSelect from '@components/common/basic/CustomSelect';

const SelectSiteLanguage = ({ className }) => {
	const languages = [
		{ code: 'fi', label: 'Suomi', emoji: '🇫🇮' },
		{ code: 'ru', label: 'Русский', emoji: '🇷🇺' }
	];

	const [currentLanguageCode, setCurrentLanguageCode] = useState(i18n.language);

	useEffect(() => {
		const handleLanguageChanged = (lng) => {
			setCurrentLanguageCode(lng);
		};

		i18n.on('languageChanged', handleLanguageChanged);

		return () => {
			i18n.off('languageChanged', handleLanguageChanged);
		};
	}, []);

	const handleChange = (selectedOption) => {
		i18n.changeLanguage(selectedOption.value);
	};

	const currentLanguage = languages.find((lang) => lang.code === currentLanguageCode);
	const selectValue = { value: currentLanguage.code, label: `${currentLanguage.emoji} ${currentLanguage.label}` };

	const options = languages.map((lang) => ({
		value: lang.code,
		label: `${lang.emoji} ${lang.label}`
	}));

	return <CustomSelect className={className} value={selectValue} onChange={handleChange} options={options} />;
};

SelectSiteLanguage.propTypes = {
	className: PropTypes.string
};

export default SelectSiteLanguage;
