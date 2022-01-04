import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { getSponsorTeachingsFeedData } from '@lib/generated/graphql';
import { generateFeed } from '@lib/generateFeed';
import getIntl from '@lib/getIntl';
import { getLanguageIdByRoute } from '@lib/getLanguageIdByRoute';

export default (): void => void 0;

export async function getServerSideProps({
	params,
	res,
}: GetServerSidePropsContext<{ language: string; id: string }>): Promise<
	GetServerSidePropsResult<Record<string, unknown>>
> {
	const id = params?.id as string;
	const languageRoute = params?.language as string;

	const { sponsor } = await getSponsorTeachingsFeedData({
		id,
	}).catch(() => ({
		sponsor: null,
	}));
	if (!sponsor || sponsor.language !== getLanguageIdByRoute(params?.language)) {
		return {
			notFound: true,
		};
	}

	if (res) {
		res.setHeader('Content-Type', 'text/xml');

		const intl = await getIntl(languageRoute);
		const feed = await generateFeed(
			languageRoute,
			{
				link: sponsor.canonicalUrl,
				title: intl.formatMessage(
					{
						id: 'sponsorTeachingsFeed__title',
						defaultMessage: 'Sermons by {name}',
					},
					{ name: sponsor.title }
				),
				description: intl.formatMessage(
					{
						id: 'sponsorTeachingsFeed__description',
						defaultMessage: 'The latest recordings from {title} at AudioVerse',
					},
					{ title: sponsor.title }
				),
			},
			sponsor.recordings.nodes || []
		);
		res.write(feed);

		res.end();
	}

	return {
		props: {},
	};
}
