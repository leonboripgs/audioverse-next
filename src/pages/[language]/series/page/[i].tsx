import { GetStaticPathsResult } from 'next';

import SeriesList, { SeriesListProps } from '@containers/series/list';
import {
	getSeriesListPageData,
	getSeriesListPathsData,
} from '@lib/generated/graphql';
import { getNumberedStaticPaths } from '@lib/getNumberedStaticPaths';
import { getPaginatedStaticProps } from '@lib/getPaginatedStaticProps';

export default SeriesList;

export async function getStaticProps({
	params,
}: {
	params: { language: string; i: string };
}): Promise<StaticProps<SeriesListProps>> {
	return getPaginatedStaticProps(
		params,
		getSeriesListPageData,
		(d) => d.serieses.nodes,
		(d) => d.serieses.aggregate?.count
	);
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
	return getNumberedStaticPaths(
		'series',
		getSeriesListPathsData,
		(d) => d.serieses.aggregate?.count
	);
}
