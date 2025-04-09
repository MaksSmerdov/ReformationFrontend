import { useCallback, useEffect, useState } from 'react';
import IconButton from '@components/common/icon/IconButton';
import { Pencil, Trash, X, Save } from 'react-bootstrap-icons';
import { fakeOrderId } from '@slices/facades/elementOrdersSlice';
import { useTranslation } from 'react-i18next';

const EDIT_MODE = 'edit';
const VIEW_MODE = 'view';

function getM2(width, height) {
    return ((width * height) / 1000000).toFixed(2);
}

export const MaterialsTableRow = ({ material, onDelete, onCreate, onUpdate }) => {
    const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.facade_view_page.element_orders_table.side_select_potions' });
    const [currentMaterial, setCurrentMaterial] = useState(material);
    const [tempMaterial, setTempMaterial] = useState();

    const { id, sku, title, width, height, side, price, note, order_id } = currentMaterial;

    const [mode, setMode] = useState(VIEW_MODE);

    const getOptionsLabel = useCallback((value) => {
        if(!value) return '';
        if (value === 'entire_element') return t('entire_element');
        if (value === 'right') return t('right');
        if (value === 'left') return t('left');
        if (value === 'top') return t('top');
        if (value === 'bottom') return t('bottom');
    }, [])

    useEffect(() => {
        setCurrentMaterial(material);
        if (material.order_id === fakeOrderId) {
            setMode(EDIT_MODE);
        }
    }, [material])

    const handleEditClick = () => {
        setTempMaterial(material);
        setMode(EDIT_MODE);
    }

    const handleCancelClick = () => {
        setMode(VIEW_MODE);
        if (currentMaterial.order_id === fakeOrderId) {
            onDelete(currentMaterial.id, order_id);
        }
        setCurrentMaterial(tempMaterial);
    }

    const handleSavelClick = () => {
        handleCancelClick();
        if (currentMaterial.order_id === fakeOrderId) {
            onCreate(currentMaterial);
        } else {
            onUpdate(order_id, currentMaterial);
        }
    }

    const handleSKUChange = (e) => {
        setCurrentMaterial(prev => {
            return ({
                ...prev,
                sku: e.target.value
            })
        })
    }

    const handleTitleChange = (e) => {
        setCurrentMaterial(prev => {
            return ({
                ...prev,
                title: e.target.value
            })
        })
    }

    const handleWidthChange = (e) => {
        setCurrentMaterial(prev => {
            return ({
                ...prev,
                width: e.target.value
            })
        })
    }

    const handleHeigthChange = (e) => {
        setCurrentMaterial(prev => {
            return ({
                ...prev,
                height: e.target.value
            })
        })
    }

    const handleSideChange = (e) => {
        setCurrentMaterial(prev => {
            return ({
                ...prev,
                side: e.target.value
            })
        })
    }

    const handlePriceChange = (e) => {
        setCurrentMaterial(prev => {
            return ({
                ...prev,
                price: e.target.value
            })
        })
    }


    const handleNoteChange = (e) => {
        setCurrentMaterial(prev => {
            return ({
                ...prev,
                note: e.target.value
            })
        })
    }
    return (
        <tr>
            {
                mode === VIEW_MODE ? (
                    <>
                        <td>{sku}</td>
                        <td>{title}</td>
                        <td>{width}</td>
                        <td>{height}</td>
                        <td>{price}</td>
                        <td>{getOptionsLabel(side)}</td>
                        <td>{getM2(width, height)}</td>
                        <td>{note}</td>
                    </>
                ) : (
                    <>
                        <td><input style={{ width: 50 }} value={sku} onChange={handleSKUChange} /></td>
                        <td><input style={{ width: 50 }} value={title} onChange={handleTitleChange} /></td>
                        <td><input style={{ width: 50 }} value={width} onChange={handleWidthChange} /></td>
                        <td><input style={{ width: 50 }} value={height} onChange={handleHeigthChange} /></td>
                        <td><input style={{ width: 50 }} value={price} onChange={handlePriceChange} /></td>
                        <td>
                            <select style={{ width: 50 }} value={side ?? undefined} onChange={handleSideChange}>
                                <option value="entire_element">{t('entire_element')}</option>
                                <option value="right">{t('right')}</option>
                                <option value="left">{t('left')}</option>
                                <option value="bottom">{t('bottom')}</option>
                                <option value="top">{t('top')}</option>
                            </select>
                        </td>
                        <td>{getM2(width, height)}</td>
                        <td><input style={{ width: 50 }} value={note} onChange={handleNoteChange} maxLength={100} /></td>
                    </>
                )
            }

            <td>{
                <div className='d-flex gap-2'>
                    {
                        mode === VIEW_MODE ? (
                            <>
                                <IconButton icon={Pencil} variant="outline-primary" onClick={handleEditClick} className="wh-resize-button" />
                                <IconButton icon={Trash} variant="outline-danger" onClick={() => onDelete(id, order_id)} className="wh-resize-button" />
                            </>
                        ) :
                            (
                                <>
                                    <IconButton icon={Save} variant="outline-primary" onClick={handleSavelClick} className="wh-resize-button" />
                                    <IconButton icon={X} variant="outline-danger" onClick={handleCancelClick} className="wh-resize-button" />
                                </>
                            )
                    }

                </div>
            }</td>
        </tr>
    )
}