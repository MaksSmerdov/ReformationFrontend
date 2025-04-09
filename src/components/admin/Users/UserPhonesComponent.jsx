import React, { useCallback, useState } from 'react';
import { Form, InputGroup, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import IconButton from '@components/common/icon/IconButton';
import { PlusLg, Trash, ArrowCounterclockwise } from 'react-bootstrap-icons';
import IconEvent from '@components/common/icon/IconEvent';

const UserPhonesComponent = ({ phones, setPhones, className, ...props }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.user_modal' });

	const handlePhoneChange = useCallback(
		(index, value) => {
			const updatedPhones = phones.map((phone, i) => (i === index ? { ...phone, phone: value, isUpdated: true } : phone));
			setPhones(updatedPhones);
		},
		[phones, setPhones]
	);

	const handleAddPhone = useCallback(() => {
		setPhones([...phones, { phone: '', isCreating: true }]);
	}, [phones, setPhones]);

	const handleRemovePhone = useCallback(
		(index) => {
			const updatedPhones = phones.map((phone, i) => (i === index ? { ...phone, isDeleting: !phone.isDeleting } : phone));
			setPhones(updatedPhones);
		},
		[phones, setPhones]
	);

	const handleRestorePhone = useCallback(
		(index) => {
			const updatedPhones = phones.map((phone, i) => (i === index ? { ...phone, isDeleting: false } : phone));
			setPhones(updatedPhones);
		},
		[phones, setPhones]
	);

	return (
		<Card className={className} {...props}>
			<Card.Body className="p-0 overflow-hidden">
				<div className="p-2px d-grid gap-2px align-items-center overflow-auto" style={{ gridTemplateColumns: 'min-content min-content 1fr min-content', maxHeight: '300px' }}>
					{phones.map((phone, index) => (
						<React.Fragment key={phone.id || index}>
							<IconEvent className="wh-resize-button" isCreating={phone.isCreating} isDeleting={phone.isDeleting} isUpdated={phone.isUpdated} isValid={!!phone.phone} />
							<div className="fw-bold">+358</div>
							<div className="d-flex h-fill-available">
								<Form.Control type="text" value={phone.phone} key={phone.id || index} onChange={(e) => handlePhoneChange(index, e.target.value)} readOnly={phone.isDeleting} className="h-100 px-2 py-1px lh-1 flex-grow-1" />
							</div>
							<IconButton icon={phone.isDeleting ? ArrowCounterclockwise : Trash} variant={phone.isDeleting ? 'warning' : 'danger'} onClick={() => (phone.isDeleting ? handleRestorePhone(index) : handleRemovePhone(index))} className="wh-resize-button" />
						</React.Fragment>
					))}
					<div className="d-flex justify-content-center" style={{ gridColumn: 'span 4' }}>
						<IconButton className="w-100 h-resize-button" icon={PlusLg} variant="success" onClick={handleAddPhone} />
					</div>
				</div>
			</Card.Body>
		</Card>
	);
};

export default React.memo(UserPhonesComponent);
