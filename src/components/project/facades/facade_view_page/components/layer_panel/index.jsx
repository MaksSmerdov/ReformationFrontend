import { LayerPanelItem } from './LayerPanelItem';
import { useSelector } from 'react-redux';
import { selectElementGroupsByFacadeId } from '@slices/facades/elementGroupsSlice';
import { useMemo } from 'react';

export const LayerPanel = ({ facadeId }) => {
    const elementGroups = useSelector((state) => selectElementGroupsByFacadeId(state, facadeId));

    const layers = useMemo(() => {
        return elementGroups.filter(item => item.type === 'layer');
    }, [elementGroups])

    return (
        <div className='d-flex justify-content-start flex-wrap mb-3'>
            {layers.map((item) => <LayerPanelItem key={item.id} id={item.id} title={item.title}/>)}
        </div>
    )
}
