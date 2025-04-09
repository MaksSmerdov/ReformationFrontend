export function buildNestedElementGroups(elementGroups, elements) {
	const groupMap = new Map();

	elementGroups.forEach((group) => {
		groupMap.set(group.id, { ...group, children: [], elements: [] });
	});

	elements.forEach((element) => {
		const group = groupMap.get(element.element_group_id);
		if (group) {
			group.elements.push(element);
		}
	});

	const nestedGroups = [];
	groupMap.forEach((group) => {
		if (group.parent_id) {
			const parentGroup = groupMap.get(group.parent_id);
			if (parentGroup) {
				parentGroup.children.push(group);
			}
		} else {
			nestedGroups.push(group);
		}
	});

	return nestedGroups;
}

export function createItems(guides, nestedElementGroups, handleSelectItem) {
	return [
		{
			key: 'guides',
			label: 'Guides',
			expanded: true,
			selectable: false,
			hiddable: false,
			children: [
				{
					key: 'verticalGuides',
					label: 'Vertical Guides',
					expanded: true,
					selectable: false,
					hiddable: false,
					children: guides
						.filter((guide) => guide.direction === 'vertical')
						.map((guide) => ({
							key: `guide-${guide.id}`,
							entityId: guide.id,
							entityType: 'guide',
							label: guide.title,
							expanded: true,
							selectable: true,
							hiddable: false
						}))
				},
				{
					key: 'horizontalGuides',
					label: 'Horizontal Guides',
					expanded: true,
					selectable: false,
					hiddable: false,
					children: guides
						.filter((guide) => guide.direction === 'horizontal')
						.map((guide) => ({
							key: `guide-${guide.id}`,
							entityId: guide.id,
							entityType: 'guide',
							label: guide.title,
							expanded: true,
							selectable: true,
							hiddable: false
						}))
				}
			]
		},
		{
			key: 'elementGroups',
			label: 'Element Groups',
			expanded: true,
			selectable: false,
			hiddable: false,
			children: nestedElementGroups.map((layer) => ({
				key: `group-${layer.id}`,
				entityId: layer.id,
				entityType: 'group',
				label: layer.title,
				expanded: true,
				selectable: true,
				hiddable: true,
				children: layer.children.map((cluster) => ({
					key: `group-${cluster.id}`,
					entityId: cluster.id,
					entityType: 'group',
					label: cluster.title,
					expanded: true,
					selectable: true,
					hiddable: true,
					children: cluster.children.map((group) => ({
						key: `group-${group.id}`,
						entityId: group.id,
						entityType: 'group',
						label: group.title,
						expanded: true,
						selectable: true,
						hiddable: true,
						children: group.elements.map((element) => ({
							key: `element-${element.id}`,
							entityId: element.id,
							entityType: 'element',
							label: element.title,
							expanded: true,
							selectable: true,
							hiddable: false
						}))
					}))
				}))
			}))
		}
	];
}
