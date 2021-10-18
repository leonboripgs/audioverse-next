import { capitalize } from 'lodash';
import React, { FormEvent, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';

import Heading1 from '@components/atoms/heading1';
import Heading2 from '@components/atoms/heading2';
import Heading3 from '@components/atoms/heading3';
import withAuthGuard from '@components/HOCs/withAuthGuard';
import Button from '@components/molecules/button';
import Checkbox from '@components/molecules/form/checkbox';
import Select from '@components/molecules/form/select';
import AccountNav from '@components/organisms/accountNav';
import {
	Language,
	RecordingQuality,
	Timezone,
	useGetAccountPreferencesDataQuery,
	useUpdateAccountPreferencesMutation,
} from '@lib/generated/graphql';

import styles from './preferences.module.scss';

function Profile(): JSX.Element {
	const queryClient = useQueryClient();
	const { data } = useGetAccountPreferencesDataQuery() || {};

	const [autoplay, setAutoplay] = useState(false);
	const [language, setLanguage] = useState<any>(Language.English);
	const [preferredAudioQuality, setPreferredAudioQuality] = useState<any>(
		RecordingQuality.Low
	);
	const [timezone, setTimezone] = useState<any>(Timezone.AmericaNewYork);

	const { mutate } = useUpdateAccountPreferencesMutation({
		onSuccess: () =>
			queryClient.invalidateQueries(['getAccountPreferencesData']),
	});
	const intl = useIntl();

	useEffect(() => {
		const d = data?.me?.user;

		setAutoplay(d ? d.autoplay || false : autoplay);
		setLanguage(d ? d.language : language);
		setPreferredAudioQuality(
			d
				? d.preferredAudioQuality || RecordingQuality.Low
				: preferredAudioQuality
		);
		setTimezone(d ? d.timezone || Timezone.AmericaNewYork : timezone);
	}, [data]);

	function submit(e?: FormEvent<HTMLFormElement>) {
		e?.preventDefault();

		return mutate({
			language: language as Language,
			preferredAudioQuality: preferredAudioQuality as RecordingQuality,
			timezone: timezone as Timezone,
			autoplay,
		});
	}

	const languageMap: { [K in Language]: string } = {
		[Language.Chinese]: '中文',
		[Language.English]: 'English',
		[Language.French]: 'Français',
		[Language.German]: 'Deutsch',
		[Language.Japanese]: '日本語',
		[Language.Nordic]: 'Nordic',
		[Language.Russian]: 'Русский',
		[Language.Spanish]: 'Español',
	};

	return (
		<>
			<Heading1>
				<FormattedMessage
					id="preferences__heading"
					defaultMessage="Account Settings"
				/>
			</Heading1>
			<AccountNav current="preferences" />
			<div className={styles.container}>
				<Heading2 className={styles.subheading}>
					<FormattedMessage
						id="preferences__subheading"
						defaultMessage="Preferences"
					/>
				</Heading2>
				<form onSubmit={submit}>
					<Select
						label={intl.formatMessage({
							id: 'preferences__language',
							defaultMessage: 'Language',
						})}
						value={language}
						setValue={setLanguage}
						options={Object.keys(Language).map((key: any) => {
							const value = (Language as any)[key];
							return {
								label: (languageMap as any)[value],
								value,
							};
						})}
					/>

					<Select
						label={intl.formatMessage({
							id: 'preferences__timezone',
							defaultMessage: 'Timezone',
						})}
						value={timezone}
						setValue={setTimezone}
						options={Object.keys(Timezone).map((key: any) => {
							const value = (Timezone as any)[key];
							const [prefix, ...slugs] = value.split('_');
							const label = `${capitalize(prefix)}/${slugs
								.map(capitalize)
								.join('_')}`;
							return {
								label,
								value,
							};
						})}
					/>

					<Heading3 className={styles.sectionHeading}>
						<FormattedMessage
							id="preferences__playbackSettings"
							defaultMessage="Playback Settings"
						/>
					</Heading3>
					<p className={styles.intro}>
						<FormattedMessage
							id="preferences__playbackSettingsIntro"
							defaultMessage="Choose whether recordings should autoplay by default."
						/>
					</p>

					<Checkbox
						label={intl.formatMessage({
							id: 'preferences__inputAutoplay',
							defaultMessage: 'Autoplay recordings',
						})}
						checked={autoplay}
						toggleChecked={() => setAutoplay(!autoplay)}
					/>

					<Heading3 className={styles.sectionHeading}>
						<FormattedMessage
							id="preferences__downloadSettings"
							defaultMessage="Download Settings"
						/>
					</Heading3>
					<p className={styles.intro}>
						<FormattedMessage
							id="preferences__downloadSettingsIntro"
							defaultMessage="Choose how you want to download audio."
						/>
					</p>

					<Select
						label={intl.formatMessage({
							id: 'preferences__preferredAudioQuality',
							defaultMessage: 'Preferred Audio Quality',
						})}
						value={preferredAudioQuality}
						setValue={setPreferredAudioQuality}
						options={[
							{
								label: intl.formatMessage({
									id: 'preferences__preferredAudioQuality-high',
									defaultMessage: 'High',
								}),
								value: RecordingQuality.Highest,
							},
							{
								label: intl.formatMessage({
									id: 'preferences__preferredAudioQuality-medium',
									defaultMessage: 'Medium',
								}),
								value: RecordingQuality.Low,
							},
							{
								label: intl.formatMessage({
									id: 'preferences__preferredAudioQuality-low',
									defaultMessage: 'Low',
								}),
								value: RecordingQuality.Lowest,
							},
						]}
					/>

					<Button
						type="super"
						text={
							<FormattedMessage
								id="preferences__buttonLabelSubmit"
								defaultMessage="Submit"
								description="save button label"
							/>
						}
						onClick={() => submit()}
					/>
				</form>
			</div>
		</>
	);
}

export default withAuthGuard(Profile);
