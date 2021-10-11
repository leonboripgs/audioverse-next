import { when } from 'jest-when';

import {
	GetSponsorSeriesPageDataDocument,
	GetSponsorSeriesPathsDataDocument,
	SequenceContentType,
} from '@lib/generated/graphql';
import {
	buildLoader,
	buildStaticRenderer,
	mockedFetchApi,
} from '@lib/test/helpers';
import SponsorSeries, {
	getStaticPaths,
	getStaticProps,
} from '@pages/[language]/sponsors/[id]/series/page/[i]';

const renderPage = buildStaticRenderer(SponsorSeries, getStaticProps, {
	language: 'en',
	id: 'the_sponsor_id',
	i: '1',
});

const loadData = buildLoader(GetSponsorSeriesPageDataDocument, {
	sponsor: {
		id: 'the_sponsor_id',
		title: 'the_sponsor_title',
		canonicalPath: 'the_sponsor_path',
		imageWithFallback: {
			url: 'the_sponsor_image',
		},
	},
	sequences: {
		nodes: [
			{
				id: 'the_series_id',
				title: 'the_series_title',
				canonicalPath: 'the_series_path',
				contentType: SequenceContentType.Series,
				speakers: [],
				allRecordings: {
					aggregate: {
						count: 0,
					},
				},
			},
		],
		aggregate: {
			count: 100,
		},
	},
});

describe('sponsor series page', () => {
	it('renders', async () => {
		await renderPage();
	});

	it('generates static paths', async () => {
		when(mockedFetchApi)
			.calledWith(GetSponsorSeriesPathsDataDocument, expect.anything())
			.mockResolvedValue({
				sponsors: {
					nodes: [
						{
							id: 'the_sponsor_id',
						},
					],
				},
			});

		const { paths } = await getStaticPaths();

		expect(paths).toContain('/en/sponsors/the_sponsor_id/series/page/1');
	});

	it('renders sponsor image', async () => {
		loadData();

		const { getByAltText } = await renderPage();

		expect(getByAltText('the_sponsor_title')).toHaveAttribute(
			'src',
			'the_sponsor_image'
		);
	});

	it('skips sponsor image if none provided', async () => {
		loadData({
			sponsor: {
				imageWithFallback: {
					url: null as any,
				},
			},
		});

		const { queryByAltText } = await renderPage();

		expect(queryByAltText('the_sponsor_title')).not.toBeInTheDocument();
	});

	it('renders sponsor title', async () => {
		loadData();

		const { getByText } = await renderPage();

		expect(getByText('the_sponsor_title')).toBeInTheDocument();
	});

	it('renders page subtitle', async () => {
		loadData();

		const { getByText } = await renderPage();

		expect(getByText('Series')).toBeInTheDocument();
	});

	it('lists series', async () => {
		loadData();

		const { getByText } = await renderPage();

		expect(getByText('the_series_title')).toBeInTheDocument();
	});

	it('links pagination properly', async () => {
		loadData();

		const { getByText } = await renderPage();

		expect(getByText('1')).toHaveAttribute(
			'href',
			'/en/sponsors/the_sponsor_id/series/page/1'
		);
	});

	it('renders 404', async () => {
		when(mockedFetchApi)
			.calledWith(GetSponsorSeriesPageDataDocument, expect.anything())
			.mockRejectedValue('oops');

		const { getByText } = await renderPage();

		expect(getByText('Sorry!')).toBeInTheDocument();
	});
});
