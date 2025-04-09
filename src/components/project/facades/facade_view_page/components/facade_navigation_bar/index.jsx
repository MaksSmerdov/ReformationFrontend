import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { fetchGroupFacades } from '@slices/facades/groupFacadesSlice';
import { useTranslation } from 'react-i18next';

export const FacadeNavigationBar = ({ projectId }) => {
    const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.facade_view_page.navigation_bar' });
    const navigate = useNavigate();
    const { facadeId } = useParams();
    const dispatch = useDispatch();
    const groupFacades = useSelector((state) => state.groupFacades.byProjectId[projectId]);

    useEffect(() => {
        if (!groupFacades) {
            dispatch(fetchGroupFacades(projectId))
        }
    }, [groupFacades, projectId])

    const idArray = useMemo(() => {
        if (!groupFacades) {
            return;
        }
        return groupFacades.map(item => item.id);
    }, [groupFacades]);

    const currentIdx = useMemo(() => {
        if (!idArray) {
            return;
        }
        return idArray.findIndex(item => item == facadeId)
    }, [idArray, facadeId]);

    const handleToHomeClick = () => {
        navigate(`/project/${projectId}`);
        navigate(0);
    }

    const handleForwardClick = () => {
        const n = idArray.length;
        const nextIdx = currentIdx + 1;
        const id = idArray[(nextIdx % n + n) % n];
        if (id) {
            navigate(`/project/${projectId}/facade/${id}`);
            navigate(0);
        }
    }

    const handleBackwardClick = () => {
        const n = idArray.length;
        const prevIdx = currentIdx - 1;
        const id = idArray[(prevIdx % n + n) % n];
        if (id) {
            navigate(`/project/${projectId}/facade/${id}`);
            navigate(0);
        }
    }

    return (
        <div className='d-flex justify-content-between'>
            <Button className='rounded-0 pe-5 ps-5' variant="success" onClick={handleBackwardClick}>{t('backward')}</Button>
            <Button className='rounded-0 pe-5 ps-5' variant="secondary" onClick={handleToHomeClick}>{t('toHome')}</Button>
            <Button className='rounded-0 pe-5 ps-5' variant="danger" onClick={handleForwardClick}>{t('forward')}</Button>
        </div>
    )
}
