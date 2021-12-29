import {
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next';

import { IBaseProps } from '@containers/base';
import CollectionDetail, {
	CollectionDetailProps,
} from '@containers/collection/detail';
import { getCollectionDetailPageData } from '@containers/collection/detail.generated';
import { REVALIDATE } from '@lib/constants';
import { getCollectionDetailPathsData } from '@lib/generated/graphql';
import { getDetailStaticPaths } from '@lib/getDetailStaticPaths';
import { getLanguageIdByRoute } from '@lib/getLanguageIdByRoute';

export default CollectionDetail;

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ language: string; id: string }>): Promise<
	GetStaticPropsResult<CollectionDetailProps & IBaseProps>
> {
	const id = params?.id as string;
	const { collection } = await getCollectionDetailPageData({ id }).catch(
		() => ({
			collection: null,
		})
	);
	if (collection?.language !== getLanguageIdByRoute(params?.language)) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			collection,
			title: collection?.title,
			canonicalUrl: collection?.canonicalUrl,
		},
		revalidate: REVALIDATE,
	};
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
	return getDetailStaticPaths(
		getCollectionDetailPathsData,
		(d) => d.collections.nodes,
		(l, { canonicalPath }) => canonicalPath
	);
}
