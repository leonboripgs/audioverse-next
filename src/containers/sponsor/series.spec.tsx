import { buildLoader, buildRenderer, mockedFetchApi } from '@lib/test/helpers';
import SponsorSeries, {
	getStaticProps,
	getStaticPaths,
} from '@pages/[language]/sponsors/[id]/series/page/[i]';
import {
	GetSponsorSeriesPageDataDocument,
	GetSponsorSeriesPathsDataDocument,
} from '@lib/generated/graphql';
import { when } from 'jest-when';

const renderPage = buildRenderer(SponsorSeries, getStaticProps, {
	language: 'en',
	id: 'the_sponsor_id',
	i: '1',
});

const loadData = buildLoader(GetSponsorSeriesPageDataDocument, {
	sponsor: {
		title: 'the_sponsor_title',
		imageWithFallback: {
			url: 'the_sponsor_image',
		},
	},
	serieses: {
		nodes: [
			{
				id: 'the_series_id',
				title: 'the_series_title',
				imageWithFallback: {
					url: 'the_series_image',
				},
			},
		],
		aggregate: {
			count: 1,
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

	it('links sponsor title', async () => {
		loadData();

		const { getByText } = await renderPage();

		expect(getByText('the_sponsor_title')).toHaveAttribute(
			'href',
			'/en/sponsors/the_sponsor_id'
		);
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

		expect(getByText('404')).toBeInTheDocument();
	});
});
