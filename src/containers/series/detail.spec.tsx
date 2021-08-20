import {
	GetSeriesDetailDataDocument,
	GetSeriesDetailPathsDataDocument,
} from '@lib/generated/graphql';
import {
	buildLoader,
	buildStaticRenderer,
	mockedFetchApi,
} from '@lib/test/helpers';
import writeFeedFile from '@lib/writeFeedFile';
import SeriesDetail, {
	getStaticPaths,
	getStaticProps,
} from '@pages/[language]/series/[id]/page/[i]';

const renderPage = buildStaticRenderer(SeriesDetail, getStaticProps, {
	language: 'en',
	id: 'the_series_id',
	i: '1',
});

jest.mock('@lib/writeFeedFile');

const loadData = buildLoader(GetSeriesDetailDataDocument, {
	series: {
		id: 'the_series_id',
		title: 'the_series_title',
		imageWithFallback: {
			url: 'the_series_image',
		},
		sponsor: {
			id: 'the_sponsor_id',
			title: 'the_sponsor_title',
		},
		collection: {
			id: 'the_conference_id',
			title: 'the_conference_title',
		},
		recordings: {
			nodes: [{ id: 'the_recording_id', title: 'the_recording_title' }],
			aggregate: { count: 1 },
		},
	},
});

describe('series detail page', () => {
	it('gets series data', async () => {
		await renderPage();

		expect(mockedFetchApi).toBeCalledWith(GetSeriesDetailDataDocument, {
			variables: {
				id: 'the_series_id',
				offset: 0,
				first: 25,
			},
		});
	});

	it('renders title', async () => {
		loadData();

		const { getByText } = await renderPage();

		expect(getByText('the_series_title')).toBeInTheDocument();
	});

	it('renders 404', async () => {
		const { getByText } = await renderPage();

		expect(getByText('404')).toBeInTheDocument();
	});

	it('gets static path data', async () => {
		await getStaticPaths();

		expect(mockedFetchApi).toBeCalledWith(GetSeriesDetailPathsDataDocument, {
			variables: {
				language: 'ENGLISH',
				first: 200,
			},
		});
	});

	it('gets static path data for all languages', async () => {
		await getStaticPaths();

		expect(mockedFetchApi).toBeCalledWith(GetSeriesDetailPathsDataDocument, {
			variables: {
				language: 'SPANISH',
				first: 200,
			},
		});
	});

	it('returns static paths', async () => {
		mockedFetchApi.mockResolvedValue({
			serieses: {
				nodes: [
					{
						id: 'the_series_id',
					},
				],
			},
		});

		const result = await getStaticPaths();

		expect(result.paths).toContain('/en/series/the_series_id/page/1');
	});

	it('lists recordings', async () => {
		loadData();

		const { getByText } = await renderPage();

		expect(getByText('the_recording_title')).toBeInTheDocument();
	});

	it('links pagination properly', async () => {
		loadData();

		const { getByText } = await renderPage();

		expect(getByText('1')).toHaveAttribute(
			'href',
			'/en/series/the_series_id/page/1'
		);
	});

	it('renders series image', async () => {
		loadData();

		const { getByAltText } = await renderPage();

		expect(getByAltText('the_series_title')).toHaveAttribute(
			'src',
			'the_series_image'
		);
	});

	it('links to sponsor', async () => {
		loadData();

		const { getByText } = await renderPage();

		expect(getByText('Sponsor: the_sponsor_title')).toHaveAttribute(
			'href',
			'/en/sponsors/the_sponsor_id'
		);
	});

	it('links to conference', async () => {
		loadData();

		const { getByText } = await renderPage();

		expect(getByText('Conference: the_conference_title')).toHaveAttribute(
			'href',
			'/en/conferences/the_conference_id/page/1'
		);
	});

	it('skips rendering conference link if no conference', async () => {
		loadData({ series: { collection: { id: null as any, title: '' } } });

		const { queryByText } = await renderPage();

		expect(queryByText('Conference:')).not.toBeInTheDocument();
	});

	it('generates rss', async () => {
		loadData();

		await getStaticProps({
			params: { language: 'en', id: 'the_series_id', i: '1' },
		});

		expect(writeFeedFile).toBeCalledWith({
			recordings: expect.anything(),
			title: 'the_series_title | AudioVerse English',
			projectRelativePath: 'public/en/series/the_series_id.xml',
		});
	});

	it('does not generate rss on page 2', async () => {
		loadData();

		await getStaticProps({
			params: { language: 'en', id: 'the_series_id', i: '2' },
		});

		expect(writeFeedFile).not.toBeCalled();
	});

	it('links rss feed', async () => {
		loadData();

		const { getByText } = await renderPage();

		expect(getByText('RSS')).toHaveAttribute(
			'href',
			'/en/series/the_series_id.xml'
		);
	});
});

// TODO: The way RSS gen is happening means it will never contain more than 25
//  recordings. Is this wrong? If a playlist has more than 25 recordings, should
//  the RSS file contain all of them?
