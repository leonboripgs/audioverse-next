import clsx from 'clsx';
import Link from 'next/link';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Heading6 from '@components/atoms/heading6';
import ProgressBar from '@components/atoms/progressBar';
import { useIsRecordingFavorited } from '@lib/api';
import { BaseColors } from '@lib/constants';
import { TeaseRecordingFragment } from '@lib/generated/graphql';
import { useFormattedDuration } from '@lib/time';
import usePlaybackSession from '@lib/usePlaybackSession';

import IconClosure from '../../../public/img/icon-closure.svg';
import IconDisclosure from '../../../public/img/icon-disclosure.svg';
import IconPlay from '../../../public/img/icon-play.svg';

import ButtonFavorite from './buttonFavorite';
import { CardTheme } from './card/base/withHat';
import IconButton from './iconButton';
import PersonLockup from './personLockup';
import styles from './teaseRecording.module.scss';

const isThemeDark = (theme: CardTheme): boolean =>
	['audiobookTrack', 'story', 'topic'].includes(theme);

export default function TeaseRecording({
	recording,
	theme,
	hideSpeakers,
	unpadded,
}: {
	recording: TeaseRecordingFragment;
	theme: CardTheme;
	hideSpeakers?: boolean;
	unpadded?: boolean;
}): JSX.Element {
	const intl = useIntl();
	const { isRecordingFavorited, toggleFavorited } = useIsRecordingFavorited(
		recording.id
	);
	const session = usePlaybackSession(recording);
	const progress = session.progress;
	const [personsExpanded, setPersonsExpanded] = useState(false);

	const index = recording.sequenceIndex;
	const count = recording.sequence?.recordings.aggregate?.count;

	const backgroundColor = {
		audiobookTrack: BaseColors.BOOK_B,
		chapter: BaseColors.BIBLE_B,
		sermon: BaseColors.WHITE,
		song: BaseColors.SONG_B,
		story: BaseColors.STORY_B,
		topic: BaseColors.TOPIC_B,
	}[theme];
	const isDarkTheme = isThemeDark(theme);
	const personTextColor = isDarkTheme
		? BaseColors.LIGHT_TONE
		: BaseColors.MID_TONE;

	return (
		<div className={styles.container}>
			<Link href={recording.canonicalPath}>
				<a className={clsx(styles.content, unpadded && styles.unpadded)}>
					{index && count && (
						<div className={styles.part}>
							<FormattedMessage
								id={'molecule-teaseRecording__partInfo'}
								defaultMessage={'Part {index} of {count}'}
								description={'recording tease part info'}
								values={{ index, count }}
							/>
						</div>
					)}
					<div className={styles.title}>
						<h2>{recording.title}</h2>
						<div className={styles.play}>
							<IconButton
								Icon={IconPlay}
								onPress={() => session.play()}
								color={isDarkTheme ? BaseColors.WHITE : BaseColors.DARK}
								backgroundColor={backgroundColor}
								aria-label={intl.formatMessage({
									id: 'playButton__playLabel',
									defaultMessage: 'play',
									description: 'play button play label',
								})}
							/>
						</div>
					</div>
					{!hideSpeakers && (
						<div className={styles.speakers}>
							{(personsExpanded
								? recording.persons
								: recording.persons.slice(0, 2)
							).map((p) => (
								<div key={p.canonicalPath} className={styles.presenter}>
									<PersonLockup
										person={p}
										textColor={personTextColor}
										isLinked
										isOptionalLink
										hoverColor={
											isDarkTheme ? BaseColors.SALMON : BaseColors.RED
										}
									/>
								</div>
							))}
							{recording.persons.length > 2 && (
								<div
									className={clsx(
										styles.morePersons,
										isDarkTheme && styles.dark
									)}
									onClick={(e) => {
										e.preventDefault();
										setPersonsExpanded(!personsExpanded);
									}}
								>
									{personsExpanded ? <IconClosure /> : <IconDisclosure />}
									<Heading6 sans loose unpadded uppercase>
										{personsExpanded ? (
											<FormattedMessage
												id="molecule-teaseRecording__lessPersons"
												defaultMessage="Show less"
											/>
										) : (
											<FormattedMessage
												id="molecule-teaseRecording__morePersons"
												defaultMessage="{count} more"
												values={{
													count: recording.persons.length - 2,
												}}
											/>
										)}
									</Heading6>
								</div>
							)}
						</div>
					)}
					<div className={styles.flexGrow}>
						<div
							className={clsx(
								styles.details,
								isRecordingFavorited && styles.detailsWithLike
							)}
						>
							<span className={styles.duration}>
								{useFormattedDuration(session.duration)}
							</span>
							{progress > 0 && (
								<span className={styles.progress}>
									<ProgressBar progress={progress} />
								</span>
							)}
						</div>
					</div>
				</a>
			</Link>
			<ButtonFavorite
				isFavorited={!!isRecordingFavorited}
				toggleFavorited={toggleFavorited}
				backgroundColor={backgroundColor}
				className={clsx(
					styles.like,
					unpadded && styles.likeUnpadded,
					isRecordingFavorited && styles.likeActive
				)}
				light
			/>
		</div>
	);
}
