import React, { useState, useRef } from 'react';
import { Form, Card, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Trash, PlusLg } from 'react-bootstrap-icons';
import IconEvent from '@components/common/icon/IconEvent';

const TF_Files = ({ files, setFiles, isEditable = false }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.tf' });
	const fileInputRef = useRef(null);

	const handleFileChange = (e) => {
		console.log('e.target.files:', e.target.files);
		const newFiles = Array.from(e.target.files).map((file) => {
			console.log('file:', file);
			return {
				file,
				filename: file.name,
				filetype: file.type,
				filesize: file.size,
				isCreating: true
			};
		});
		setFiles([...files, ...newFiles]);
		console.log('newFiles:', newFiles, 'files:', files);
		fileInputRef.current.value = null;
	};

	const handleFileRemove = (fileObject) => {
		const updatedFiles = files
			.map((file) => {
				if (file === fileObject) {
					if (file.isCreating) {
						return null;
					}
					if (file.isDeleting) {
						return { ...file, isDeleting: false };
					}
					return { ...file, isDeleting: true };
				}
				return file;
			})
			.filter(Boolean);
		setFiles(updatedFiles);
	};

	const handleAddFilesClick = () => {
		fileInputRef.current.click();
	};

	return (
		<div className="mw-100">
			<Form.Group controlId="formFile">
				<Form.Control className="d-none" type="file" multiple onChange={handleFileChange} ref={fileInputRef} />
			</Form.Group>

			<Card className="">
				<Card.Header className="p-2px d-flex justify-content-between align-items-center fw-bold">
					{t('Files.files')}
					{isEditable && (
						<Button variant="outline-success" className="h-100 d-flex p-0 m-0 square-element wh-resize-button" onClick={handleAddFilesClick}>
							<PlusLg className="w-100 h-100 p-1" />
						</Button>
					)}
				</Card.Header>
				<Card.Body className="p-2px d-flex flex-wrap gap-2px">
					{files.map((file, index) => (
						<Card key={index} className="">
							<Card.Header className="p-2px d-flex justify-content-between align-items-center gap-1">
								<IconEvent isCreating={file.isCreating} isDeleting={file.isDeleting} isValid={true} />
								<div className="text-wrap w-min">{file.filename}</div>
								<div className="d-flex align-items-center gap-1">
									{isEditable && (
										<Button variant="outline-danger" size="sm" className="h-100 d-flex p-0 m-0 square-element wh-resize-button" onClick={() => handleFileRemove(file)}>
											<Trash className="w-100 h-100 p-1" />
										</Button>
									)}
								</div>
							</Card.Header>
							{file.filetype && file.id && file.filetype.startsWith('image/') && (
								<Card.Body className="p-2px d-flex justify-content-center align-items-center">
									<img src={`/storage/${file.filepath}`} alt={file.filename} className="border border-black" style={{ maxWidth: '40px' }} />
								</Card.Body>
							)}
						</Card>
					))}
				</Card.Body>
			</Card>
		</div>
	);
};

export default TF_Files;
