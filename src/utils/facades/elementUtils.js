/**
 * Формирует title для элемента в формате `${newType}_${newWidth}x${newHeight}`.
 * @param {Object} element - Полноценный объект элемента.
 * @param {Object} [fieldsToApply={}] - Объект с полями, которые планируется применить к элементу.
 * @returns {string} - Сформированный title.
 */
export const generateElementTitle = (element, fieldsToApply = {}) => {
	const newWidth = fieldsToApply.width || element.width;
	const newHeight = fieldsToApply.height || element.height;
	const newTypeId = fieldsToApply.element_type_id || element.element_type_id;

	if (!newWidth || !newHeight || !newTypeId) {
		return element.title || '???';
	}

	const type = element.type?.title || '';
	const newType = fieldsToApply.element_type_id ? type.split('_')[0] : element.type?.title.split('_')[0];

	return `${newType}_${newWidth}x${newHeight}`;
};
