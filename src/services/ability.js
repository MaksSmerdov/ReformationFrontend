import { createContext, useContext, useEffect, useState } from 'react';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { getLocalStorage } from '@services/storage';

export const AbilityContext = createContext();

const defineAdminAbilities = (can, cannot) => {
	can('manage', 'all');
};

const defineUserAbilities = (can, cannot) => {
	can('read', 'DashboardPage');
	cannot('manage', 'all');
};

export const defineAbilitiesFor = (user) => {
	const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

	if (user.roles && user.roles.some((role) => role.name === 'admin')) {
		defineAdminAbilities(can, cannot);
	} else {
		defineUserAbilities(can, cannot);
	}

	return build();
};

export const useAbility = () => {
	const [ability, setAbility] = useState(defineAbilitiesFor({ roles: [], all_permissions: [] }));

	const updateAbility = (user) => {
		setAbility(defineAbilitiesFor(user));
	};

	useEffect(() => {
		// console.log('useAbility');
		const user = JSON.parse(getLocalStorage('user'));
		if (user) {
			updateAbility(user);
		}
	}, []);

	return { ability, updateAbility };
};
