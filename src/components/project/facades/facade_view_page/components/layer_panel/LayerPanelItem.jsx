import { useFacadeViewPage } from "@contexts/facades_view/FacadeViewPageContext";

export const LayerPanelItem = ({ id, title }) => {
    const { isGroupHidden, toggleGroupHidden } = useFacadeViewPage();

    const hidden = isGroupHidden(id);

    const handleClick = () => {
        toggleGroupHidden(id, !hidden);
    }

    return (
        <div
            onClick={handleClick}
            style={{
                height: 50,
                cursor: 'pointer',
                background: !hidden ? '#bbdefb' : '#e0e0e0',
                border: `5px solid ${!hidden ? '#1a237e' : '#616161'}`
            }}
            className='d-flex justify-content-center align-items-center me-3 ps-2 pe-2 mb-2'>
            {title}
        </div>
    )
}
