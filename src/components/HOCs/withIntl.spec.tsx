import { RenderResult, waitFor } from '@testing-library/react';
import React from 'react';
import * as intl from 'react-intl';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';

import CardWithPlayable from '@components/molecules/card/base/withPlayable';
import Login from '@components/molecules/login';
import PersonLockup from '@components/molecules/personLockup';
import Player from '@components/molecules/player';
import PlaylistButton from '@components/molecules/playlistButton';
import RecordingButtonFavorite from '@components/molecules/recordingButtonFavorite';
import SearchBar from '@components/molecules/searchBar';
import TeaseRecording from '@components/molecules/teaseRecording';
import Transcript from '@components/molecules/transcript';
import Footer from '@components/organisms/footer';
import Header from '@components/organisms/header';
import Navigation from '@components/organisms/navigation';
import AccountPlaylists from '@containers/account/playlists';
import Profile from '@containers/account/profile';
import Register from '@containers/account/register';
import Reset from '@containers/account/reset';
import AudiobooksList from '@containers/audiobook/list';
import Book from '@containers/bible/book';
import CollectionDetail from '@containers/collection/detail';
import CollectionList from '@containers/collection/list';
import Home from '@containers/home';
import Playlists from '@containers/playlist/list';
import Presenters from '@containers/presenter/list';
import PresenterRecordings from '@containers/presenter/recordings';
import SeriesDetail from '@containers/series/detail';
import SeriesList from '@containers/series/list';
import SermonDetail, { SermonDetailProps } from '@containers/sermon/detail';
import SermonList from '@containers/sermon/list';
import SongList from '@containers/song/albums/list';
import SponsorAlbums from '@containers/sponsor/albums';
import SponsorBooks from '@containers/sponsor/books';
import SponsorConferences from '@containers/sponsor/conferences';
import Sponsors from '@containers/sponsor/list';
import SponsorSeries from '@containers/sponsor/series';
import SponsorTeachings from '@containers/sponsor/teachings';
import StoryAlbumsList from '@containers/story/albums/list';
import TagList from '@containers/tag/list';
import * as api from '@lib/api';
import { isRecordingFavorited } from '@lib/api';
import { BaseColors } from '@lib/constants';
import {
	GetWithAuthGuardDataDocument,
	RecordingContentType,
	SequenceContentType,
} from '@lib/generated/graphql';
import { getLanguageDisplayNames } from '@lib/getLanguageDisplayNames';
import { readableBytes } from '@lib/readableBytes';
import {
	loadAuthGuardData,
	makePlaylistButtonData,
	mockedFetchApi,
	renderWithQueryProvider,
} from '@lib/test/helpers';
import { useFormattedDuration } from '@lib/time';
import Logout from '@pages/[language]/account/logout';

jest.mock('react-intl');
jest.mock('@lib/api/isRecordingFavorited');
jest.mock('@lib/api/isPersonFavorited');
jest.mock('react-toastify');
jest.mock('@lib/readableBytes');
jest.mock('@lib/time');
jest.mock('@lib/api/logout');

const expectNoUnlocalizedText = (
	screen: RenderResult,
	whitelist: string[] = []
) => {
	const {
		queryAllByText,
		queryAllByAltText,
		queryAllByPlaceholderText,
		queryAllByLabelText,
	} = screen;
	const r = /[^z\d\W\s]+/;
	const languageNames = getLanguageDisplayNames();
	const whitelist_ = [...languageNames, ...whitelist];
	const m = (c: string) => !!c.match(r) && !whitelist_.includes(c);
	const hits = [
		...queryAllByText(m),
		...queryAllByAltText(m),
		...queryAllByPlaceholderText(m),
		...queryAllByLabelText(m),
	];

	expect(hits).toHaveLength(0);
};

const expectNoUnlocalizedToasts = () => {
	const calls = (toast as any as jest.Mock).mock.calls;
	calls.forEach((c) => {
		expect(c[0]).not.toMatch(/[^z]+/);
	});
};

const expectNoUnlocalizedMessages = async <T extends unknown>(
	Component: React.ComponentType<T>,
	data: { [key: string]: any }
) => {
	const screen = await renderWithQueryProvider(
		<Component {...(data as any)} />
	);

	expectNoUnlocalizedText(screen);
	expectNoUnlocalizedToasts();
};

const toLocaleStringBackup = global.Date.prototype.toLocaleString;

describe('localization usage', () => {
	beforeEach(() => {
		jest.resetAllMocks();

		jest.spyOn(intl, 'FormattedMessage').mockImplementation((() => 'z') as any);
		jest
			.spyOn(FormattedMessage.prototype, 'shouldComponentUpdate')
			.mockImplementation(() => true);

		const formatter = jest.fn();
		formatter.mockReturnValue('z');
		jest.spyOn(intl, 'useIntl').mockReturnValue({
			formatMessage: formatter,
		} as any);

		(readableBytes as jest.Mock).mockReturnValue('z');
		(useFormattedDuration as jest.Mock).mockReturnValue('z');
	});

	beforeAll(() => {
		global.Date.prototype.toLocaleString = jest.fn(() => 'z');
	});

	afterAll(() => {
		global.Date.prototype.toLocaleString = toLocaleStringBackup;
	});

	it('localizes playlistButton logged out', async () => {
		const screen = await renderWithQueryProvider(
			<PlaylistButton recordingId={'recording_id'} />
		);

		expectNoUnlocalizedText(screen);
	});

	it('localizes playlistButton logged in', async () => {
		mockedFetchApi.mockResolvedValue(makePlaylistButtonData([]));

		const screen = await renderWithQueryProvider(
			<PlaylistButton recordingId={'recording_id'} />
		);

		await waitFor(() => expect(mockedFetchApi).toHaveBeenCalled());

		expectNoUnlocalizedText(screen);
	});

	it('localizes personLockup', async () => {
		const screen = await renderWithQueryProvider(
			<PersonLockup
				person={{
					name: 'z',
					canonicalPath: 'z',
					imageWithFallback: {
						url: 'z',
					},
				}}
				textColor={BaseColors.DARK}
			/>
		);

		expectNoUnlocalizedText(screen);
	});

	it('localizes sermon detail page', async () => {
		const screen = await renderWithQueryProvider(
			<SermonDetail
				recording={
					{
						contentType: RecordingContentType.Sermon,
						description: 'z',
						recordingDate: '2003-03-01T09:30:00.000Z',
						recordingTags: {
							nodes: [
								{
									tag: {
										id: 'z',
										name: 'z',
									},
								},
							],
						},
						videoDownloads: [
							{
								id: 'z',
								url: 'z',
								filesize: '100',
							},
						],
						sequenceIndex: 1,
						sequence: {
							canonicalPath: 'z',
							recordings: {
								nodes: [
									{ id: 1, canonicalPath: 'z', persons: [] },
									{ id: 2, canonicalPath: 'z', persons: [] },
									{ id: 3, canonicalPath: 'z', persons: [] },
								] as any,
							},
						},
						speakers: [] as any,
					} as SermonDetailProps['recording']
				}
				title={undefined}
			/>
		);

		expectNoUnlocalizedText(screen);
	});

	it('localizes Unfavorite button', async () => {
		jest.spyOn(api, 'isRecordingFavorited').mockResolvedValue(true);

		const screen = await renderWithQueryProvider(
			<RecordingButtonFavorite
				id={'recording_id'}
				backgroundColor={BaseColors.WHITE}
			/>
		);

		await waitFor(() => expect(isRecordingFavorited).toBeCalled());

		expectNoUnlocalizedText(screen);
	});

	it('localizes tag list page', async () => {
		const screen = await renderWithQueryProvider(
			<TagList
				nodes={[
					{
						id: 'z',
						name: 'z',
					},
				]}
				pagination={{ current: 0, total: 0 }}
			/>
		);

		expectNoUnlocalizedText(screen);
	});

	it('localizes header', async () => {
		const screen = await renderWithQueryProvider(<Header />);

		expectNoUnlocalizedText(screen, ['AudioVerse']);
	});

	it('localizes navigation', async () => {
		const screen = await renderWithQueryProvider(
			<Navigation onExit={() => void 0} />
		);

		expectNoUnlocalizedText(screen);
	});

	it('localizes Bible book page', async () => {
		const screen = await renderWithQueryProvider(
			<Book
				data={{
					audiobible: {
						title: 'z',
						book: {
							title: 'z',
							shareUrl: 'z',
							chapters: [
								{
									title: 'z',
									url: '',
									id: 'z',
									verses: [],
								},
							],
						},
						sponsor: {
							name: 'z',
							url: 'z',
						},
						copyrightText: 'z',
					},
				}}
			/>
		);

		expectNoUnlocalizedText(screen);
	});

	it('localizes footer', async () => {
		const screen = await renderWithQueryProvider(<Footer />);

		expectNoUnlocalizedText(screen, [
			'Types & Symbols',
			'Русский',
			'Français',
			'Español',
			'English',
			'Deutsch',
		]);
	});

	it('localizes audiobooks list page', async () => {
		const screen = await renderWithQueryProvider(
			<AudiobooksList
				nodes={[
					{
						id: 'z',
						title: 'z',
						canonicalPath: 'z',
						contentType: SequenceContentType.Audiobook,
						writers: { nodes: [] },
						recordings: {},
					} as any,
				]}
				pagination={{ total: 1, current: 1 }}
				data={undefined as any}
			/>
		);

		expectNoUnlocalizedText(screen);
	});

	it('localizes story albums list page', async () => {
		const screen = await renderWithQueryProvider(
			<StoryAlbumsList
				nodes={[
					{
						id: 'the_story_id',
						canonicalPath: '/the_story_path',
						duration: 100,
						contentType: SequenceContentType.StorySeason,
						speakers: [],
						recordings: {
							aggregate: {
								count: 0,
							},
						},
					} as any,
				]}
				pagination={undefined as any}
				data={undefined as any}
			/>
		);

		expectNoUnlocalizedText(screen);
	});

	it('localizes songs list page', async () => {
		const screen = await renderWithQueryProvider(
			<SongList data={undefined as any} />
		);

		expectNoUnlocalizedText(screen);
	});

	it('localizes conferences list page', async () => {
		const screen = await renderWithQueryProvider(
			<CollectionList
				nodes={
					[
						{
							id: 'z',
							canonicalPath: '/conference_path',
							allSequences: { aggregate: { count: 0 } },
						},
					] as any
				}
				pagination={undefined as any}
				data={undefined as any}
			/>
		);

		expectNoUnlocalizedText(screen);
	});

	it('localizes conference detail page', async () => {
		const screen = await renderWithQueryProvider(
			<CollectionDetail
				collection={{
					id: '123',
					title: 'z',
					description: '',
					duration: 123.4,
					image: null,
					location: '',
					startDate: null,
					endDate: null,
					viewerHasFavorited: false,
					sequences: {
						aggregate: {
							count: 0,
						},
						nodes: [],
					},
					persons: {
						aggregate: {
							count: 0,
						},
						nodes: [],
					},
					sponsor: {
						id: '234',
						title: 'z',
						canonicalPath: '...',
						imageWithFallback: {
							url: '',
						},
					},
				}}
				__typename="Query"
			/>
		);

		expectNoUnlocalizedText(screen);
	});

	it('localizes presenter list page', async () => {
		const screen = await renderWithQueryProvider(
			<Presenters
				nodes={[{ id: 'z', canonicalPath: '/presenter_path' }] as any}
				pagination={undefined as any}
				data={undefined as any}
			/>
		);

		expectNoUnlocalizedText(screen);
	});

	it('localizes presenter recordings page', async () => {
		const screen = await renderWithQueryProvider(
			<PresenterRecordings
				rssPath={'rssPath'}
				nodes={
					[
						{
							id: 'id',
							canonicalPath: 'the_recording_path',
							contentType: RecordingContentType.Sermon,
							persons: [],
						},
					] as any
				}
				data={
					{
						person: { name: 'z', imageWithFallback: { url: '' } },
					} as any
				}
				pagination={undefined as any}
			/>
		);

		expectNoUnlocalizedText(screen);
	});

	it('localizes sponsor list page', async () => {
		const screen = await renderWithQueryProvider(
			<Sponsors
				nodes={[
					{
						id: 'z',
						canonicalPath: 'the_path',
						imageWithFallback: {
							url: 'z',
						},
						collections: {
							aggregate: {
								count: 0,
							},
						},
					} as any,
				]}
				{...({} as any)}
			/>
		);

		expectNoUnlocalizedText(screen);
	});

	const scenarios: [React.ComponentType<any>, any][] = [
		[
			SponsorTeachings,
			{
				nodes: [
					{
						id: 'z',
						canonicalPath: 'z',
						contentType: RecordingContentType.Sermon,
						persons: [],
					},
				],
				data: {
					sponsor: {
						imageWithFallback: {
							url: 'z',
						},
					},
				},
			},
		],
		[SponsorBooks, { nodes: [{ id: 'z' }] }],
		[SponsorAlbums, { nodes: [{ id: 'z' }] }],
		[
			SponsorConferences,
			{
				nodes: [
					{
						id: 'z',
						canonicalPath: 'z',
						allSequences: { aggregate: { count: 0 } },
					},
				],
				data: {
					sponsor: {
						imageWithFallback: {
							url: 'z',
						},
					},
				},
			},
		],
		[
			SponsorSeries,
			{
				nodes: [
					{
						id: 'z',
						canonicalPath: 'z',
						contentType: SequenceContentType.Series,
						speakers: [],
						recordings: { aggregate: { count: 0 } },
					},
				],
				data: {
					sponsor: {
						imageWithFallback: {
							url: 'z',
						},
					},
				},
			},
		],
		[
			SeriesList,
			{
				nodes: [
					{
						id: 'z',
						canonicalPath: 'the_path',
						contentType: SequenceContentType.Series,
						speakers: [],
						recordings: { aggregate: { count: 0 } },
					},
				],
			},
		],
		[
			SeriesDetail,
			{ sequence: { id: 'z', recordings: { aggregate: { count: 0 } } } },
		],
		[Playlists, {}],
		[Logout, {}],
		[Register, {}],
		[Login, {}],
		[Reset, {}],
		[Profile, {}],
		[Home, {}],
		[
			CardWithPlayable,
			{
				recording: { id: 'z', canonicalPath: '', persons: [] },
				title: 'z',
				container: { length: 2, index: 1 },
			},
		],
		[Player, {}],
		[SearchBar, {}],
		[
			TeaseRecording,
			{
				recording: {
					canonicalPath: '',
					persons: [],
					sequenceIndex: 1,
					sequence: {
						recordings: {
							aggregate: {
								count: 3,
							},
						},
					},
				},
			},
		],
		[Transcript, {}],
		[SermonList, { nodes: [{ id: 1 }], pagination: { current: 1, total: 10 } }],
	];

	scenarios.map((s: [React.ComponentType, any], i: number) => {
		it(`Localizes scenario index ${i}`, async () => {
			await expectNoUnlocalizedMessages(...s);
		});
	});

	it('localizes profile page', async () => {
		loadAuthGuardData();

		const screen = await renderWithQueryProvider(<Profile />);

		await waitFor(() => {
			expect(mockedFetchApi).toBeCalledWith(
				GetWithAuthGuardDataDocument,
				expect.anything()
			);
		});

		expectNoUnlocalizedText(screen);
		expectNoUnlocalizedToasts();
	});

	it('localizes playlists page', async () => {
		loadAuthGuardData();

		const screen = await renderWithQueryProvider(<AccountPlaylists />);

		await waitFor(() => {
			expect(mockedFetchApi).toBeCalledWith(
				GetWithAuthGuardDataDocument,
				expect.anything()
			);
		});

		expectNoUnlocalizedText(screen);
		expectNoUnlocalizedToasts();
	});
});
