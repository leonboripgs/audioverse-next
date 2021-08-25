import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { BaseColors } from '@components/atoms/baseColors';
import Heading2 from '@components/atoms/heading2';
import Heading6 from '@components/atoms/heading6';
import ProgressBar from '@components/atoms/progressBar';
import Card from '@components/molecules/card';
import { formatDateRange } from '@lib/date';
import { CardCollectionFragment } from '@lib/generated/graphql';
import { useFormattedDuration } from '@lib/time';

import ListIcon from '../../../../public/img/fa-list.svg';
import LikeActiveIcon from '../../../../public/img/icon-like-active.svg';
import LikeIcon from '../../../../public/img/icon-like.svg';
import SuccessIcon from '../../../../public/img/icon-success-light.svg';
import IconButton from '../iconButton';
import TypeLockup from '../typeLockup';

import styles from './collection.module.scss';

interface CardCollectionProps {
	collection: CardCollectionFragment;
}

export default function CardCollection({
	collection,
}: CardCollectionProps): JSX.Element {
	const intl = useIntl();

	const {
		allSequences,
		canonicalPath,
		duration,
		endDate,
		image,
		startDate,
		title,
		viewerHasFavorited,
		viewerPlaybackCompletedPercentage,
	} = collection;
	const heroImage = image?.url && (
		<div className={styles.imageContainer}>
			<Image
				className={styles.hero}
				src={image?.url}
				alt={title}
				layout="fill"
				objectFit="cover"
			/>
		</div>
	);
	return (
		<Card>
			<div className={styles.container}>
				<TypeLockup
					Icon={ListIcon}
					label={intl.formatMessage({
						id: 'cardCollection_hatTitle',
						defaultMessage: 'Conference',
						description: 'Card collection hat title',
					})}
					iconColor={BaseColors.SALMON}
					textColor={BaseColors.WHITE}
				/>
				{heroImage}
				{!!(startDate && endDate) && (
					<Heading6 sans unpadded className={styles.date}>
						{formatDateRange(startDate, endDate)}
					</Heading6>
				)}
				<Heading2 unpadded className={styles.title}>
					<Link href={canonicalPath}>
						<a>{title}</a>
					</Link>
				</Heading2>
				<Heading6
					sans
					unpadded
					uppercase
					loose
					className={styles.sequencesLabel}
				>
					<FormattedMessage
						id="cardCollection_sequenceLabel"
						defaultMessage="{count} series"
						description="Card collection sequence count label"
						values={{ count: allSequences.aggregate?.count }}
					/>
				</Heading6>
				<div className={styles.details}>
					<div className={styles.duration}>
						{useFormattedDuration(duration)}
					</div>
					{viewerPlaybackCompletedPercentage >= 1 && <SuccessIcon />}
					<div className={styles.progress}>
						{viewerPlaybackCompletedPercentage > 0 && (
							<ProgressBar progress={viewerPlaybackCompletedPercentage} />
						)}
					</div>
					<IconButton
						Icon={viewerHasFavorited ? LikeActiveIcon : LikeIcon}
						onPress={() => void 0}
						color={viewerHasFavorited ? BaseColors.SALMON : BaseColors.WHITE}
						backgroundColor={BaseColors.DARK}
						className={styles.like}
					/>
				</div>
				{/* TODO: hover/link?, conditional sponsor, has favorited, sub-sequences */}
			</div>
		</Card>
	);
}
