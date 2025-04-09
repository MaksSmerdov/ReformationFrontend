import { Card, Table, Button } from 'react-bootstrap';
import { MaterialsTableRow } from './MaterialTableRow';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectElementOrders,
    fetchOrdersByElementId,
    reset,
    addEmptyOrder,
    deleteEmptyOrder,
    createOrdersByElementId,
    deleteOrderById,
    updateOrderByElementId,
    selectElementOrdersLoad,
    fakeOrderId,
    selectElementOrdersError
} from '@slices/facades/elementOrdersSlice';
import Spinner from 'react-bootstrap/Spinner';
import { useTranslation } from 'react-i18next';

export const MaterialsTable = ({ selectedElementIds, facadeId }) => {
    const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.facade_view_page.element_orders_table' });
    const orders = useSelector(selectElementOrders);
    const errorMessage = useSelector(selectElementOrdersError);
    const isLoad = useSelector(selectElementOrdersLoad);
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedElementIds.length !== 0) {
            dispatch(fetchOrdersByElementId(selectedElementIds));
        } else {
            dispatch(reset());
        }

    }, [selectedElementIds])

    const materials = useMemo(() => {
        if (orders.length === 0) {
            return [];
        };

        const nomenclatures = [];
        orders.forEach(item => {
            const id = item.id;
            const orderItems = item.order_items;

            orderItems.forEach(item => {
                nomenclatures.push({
                    id: item.nomenclature.id,
                    sku: item.nomenclature.sku,
                    title: item.nomenclature.title,
                    width: item.width,
                    height: item.height,
                    price: item.price,
                    side: item.side,
                    m2: ((item.height * item.side) / 1000000).toFixed(2),
                    note: item.nomenclature.note,
                    order_id: id,

                });
            })
        });
        return nomenclatures;
    }, [orders]);

    const isDisableCreateNewButton = useMemo(() => {
        if (selectedElementIds.length === 0) {
            return true;
        }

        const idx = materials.findIndex(item => item.order_id === fakeOrderId);
        if (idx !== -1) {
            return true;
        }
        return false;
    }, [selectedElementIds, materials]);

    const handleDelete = (_, order_id) => {
        if (order_id === fakeOrderId) {
            dispatch(deleteEmptyOrder());
        } else {
            dispatch(deleteOrderById({ order_id, facadeId }));
        }
    }

    const handleNewRowClick = () => {
        dispatch(addEmptyOrder());
    }

    const handleCreate = async (material) => {
        dispatch(createOrdersByElementId({
            selectedElementIds,
            material,
            facadeId
        }));
    }

    const handleUpdate = async (id, material) => {
        dispatch(updateOrderByElementId({ id, material }));
    }
    return (
        <>
            <Card.Text>
                {t('title')}
            </Card.Text>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>{t('columns.SKU')}</th>
                        <th>{t('columns.title')}</th>
                        <th>{t('columns.width')}</th>
                        <th>{t('columns.height')}</th>
                        <th>{t('columns.price')}</th>
                        <th>{t('columns.side')}</th>
                        <th>{t('columns.m2')}</th>
                        <th>{t('columns.note')}</th>
                        <th>
                            <div>{isLoad && <Spinner animation="border" variant="primary" size='sm' />}</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {materials.map(item => {
                        return (
                            <MaterialsTableRow
                                key={item.id + item.sku + item.order_id + item.title}
                                material={item}
                                onDelete={handleDelete}
                                onCreate={handleCreate}
                                onUpdate={handleUpdate}
                            />
                        )
                    })}
                </tbody>
            </Table>
            {errorMessage && <div className='text-danger'>{`Error ${errorMessage}`}</div>}
            <Button className='mb-3' variant="success" disabled={isDisableCreateNewButton} onClick={handleNewRowClick} >
                {`+ ${t('addButton')}`}
            </Button>
        </>
    )
}