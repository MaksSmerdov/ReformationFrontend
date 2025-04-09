import React, { useMemo } from 'react';
import { NewFacadeTreeViewProvider } from '@contexts/facades_view/NewFacadeTreeViewContext';
import NewTreeViewComponent from '@components/project/facades/facade_view_page/components/new_tree_view/NewTreeViewComponent';
import { buildNestedElementGroups, createItems } from '@utils/facades/treeViewUtils';
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

const NewTreeViewMainComponent = React.memo(({ guides, elementGroups, elements }) => {
	const nestedElementGroups = useMemo(() => buildNestedElementGroups(elementGroups, elements), [elementGroups, elements]);
	const items = useMemo(() => createItems(guides, nestedElementGroups), [guides, nestedElementGroups]);

	return (
		<DndProvider backend={HTML5Backend}>
			<NewFacadeTreeViewProvider items={items} guides={guides} elementGroups={elementGroups} elements={elements}>
				<NewTreeViewComponent />
			</NewFacadeTreeViewProvider>
		</DndProvider>
	);
});

export default NewTreeViewMainComponent;
