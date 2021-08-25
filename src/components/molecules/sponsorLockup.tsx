import React from 'react';

import { BaseColors } from '@components/atoms/baseColors';
import { SponsorLockupFragment } from '@lib/generated/graphql';

import NamedAvatar from './namedAvatar';

type Props = {
	sponsor: SponsorLockupFragment;
	textColor: BaseColors.DARK | BaseColors.WHITE | BaseColors.LIGHT_TONE;
	hoverColor: BaseColors.RED | BaseColors.SALMON;
	isLinked?: boolean;
	small?: boolean;
};

export default function SponsorLockup({
	sponsor: { title, imageWithFallback, canonicalPath },
	isLinked,
	...props
}: Props): JSX.Element {
	return (
		<NamedAvatar
			name={title}
			image={imageWithFallback.url}
			href={isLinked ? canonicalPath : undefined}
			{...props}
		/>
	);
}
