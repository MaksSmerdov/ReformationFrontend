import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTeams } from '@slices/teams/teamsSlice';
import CustomSelect from '@components/common/basic/CustomSelect';
import IconSpecialization from '@components/common/icon/IconSpecialization';
import TeamUsersViewer from '@components/admin/Teams/TeamUsersViewer';
import TeamEquipmentsViewer from '@components/admin/Teams/TeamEquipmentsViewer';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SelectTeam = ({ value, onChange, isMulti = false, ...props }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });
	const dispatch = useDispatch();
	const teams = useSelector((state) => state.teams.items);
	const status = useSelector((state) => state.teams.status.fetchAll);

	const [selectedOptions, setSelectedOptions] = useState([]);

	useEffect(() => {
		if (status !== 'succeeded') {
			dispatch(fetchAllTeams());
		}
	}, [dispatch, status]);

	useEffect(() => {
		const options = teams.map((teamObject) => ({
			value: teamObject.team.id,
			label: teamObject.team.title,
			teamObject: teamObject
		}));
		const selected = options.filter((option) => (Array.isArray(value) ? value.includes(option.value) : value === option.value));
		setSelectedOptions(selected);
	}, [teams, value]);

	if (status !== 'succeeded') {
		return <Spinner animation="border" />;
	}

	const handleChange = (selectedOptions) => {
		setSelectedOptions(selectedOptions);
		if (onChange) {
			onChange(isMulti ? selectedOptions.map((option) => option.value) : selectedOptions.value);
		}
	};

	const options = teams.map((teamObject) => ({
		value: teamObject.team.id,
		label: teamObject.team.title,
		teamObject: teamObject
	}));

	return (
		<CustomSelect
			style={{ zIndex: 2000 }}
			value={selectedOptions}
			onChange={handleChange}
			options={options}
			isLoading={status === 'loading'}
			placeholder={t('select_team.placeholder')}
			isMulti={isMulti}
			formatOptionLabel={({ value, teamObject }, { context }) => {
				return (
					<div className="d-flex flex-column gap-2px">
						<div className="d-flex flex-row gap-2px align-items-center">
							<IconSpecialization id={teamObject.team.specialization_id} title={teamObject.team.title} />
							<div>{teamObject.team.title}</div>
						</div>
						{context === 'menu' && (
							<div className="d-flex flex-row gap-1 ps-4">
								<div className="d-flex flex-column gap-1px">
									<div>{t('users')}</div>
									<TeamUsersViewer users={teamObject.users} showRole={false} />
								</div>
								<div className="d-flex flex-column gap-1px">
									<div>{t('equipments')}</div>
									<TeamEquipmentsViewer equipments={teamObject.equipments} />
								</div>
							</div>
						)}
					</div>
				);
			}}
			{...props}
		/>
	);
};

export default SelectTeam;
