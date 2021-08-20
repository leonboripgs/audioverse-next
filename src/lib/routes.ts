const slug = (s: string): string => s.replace(/\s/g, '-').toLowerCase();

// TODO: Confirm that this properly passes through the args types
const withGuard = <T extends any[]>(
	func: (...args: T) => string,
	exceptions: number[] = []
) => {
	return (...args: T) => {
		args.forEach((arg, index) => {
			if (arg) return;
			if (exceptions.includes(index)) return;
			throw new Error(
				`Required argument was falsy. Received: ${JSON.stringify(args)}`
			);
		});

		return func(...args);
	};
};

export const makePaginationRoute = withGuard(
	(base: string, page: number | string): string => `${base}/page/${page}`
);

export const makeSermonRoute = withGuard(
	(languageRoute: string, sermonId: string): string =>
		`/${languageRoute}/sermons/${sermonId}`
);

// TODO: rename to makePresenterDetailRoute
export const makePersonRoute = withGuard(
	(
		languageRoute: string,
		personId: string,
		page: number | string = 1
	): string => `/${languageRoute}/presenters/${personId}/page/${page}`
);

export const makePresenterListRoute = withGuard(
	(languageRoute: string, page: number | string): string =>
		`/${languageRoute}/presenters/page/${page}`
);

export const makeSeriesDetailRoute = withGuard(
	(
		languageRoute: string,
		seriesId: string,
		page: number | string = 1
	): string => `/${languageRoute}/series/${seriesId}/page/${page}`
);

export const makeSeriesListRoute = withGuard(
	(languageRoute: string, page: number | string = 1): string =>
		`/${languageRoute}/series/page/${page}`
);

export const makeTagDetailRoute = withGuard(
	(languageRoute: string, tagName: string, pageIndex = 1): string =>
		`/${languageRoute}/tags/${encodeURIComponent(tagName)}/page/${pageIndex}`
);

export const makeTagListRoute = withGuard(
	(languageRoute: string, pageIndex = 1): string =>
		`/${languageRoute}/tags/page/${pageIndex}`
);

export const makeSermonListRoute = withGuard(
	(languageRoute: string, filter: string, page: number | string): string =>
		`/${languageRoute}/sermons/${filter}/page/${page}`,
	[1]
);

// TODO: use makeSermonListRoute
// TODO: default page to 1
export const makeSermonListRouteAll = withGuard(
	(languageRoute: string, page: number | string): string =>
		`/${languageRoute}/sermons/all/page/${page}`
);

// TODO: use makeSermonListRoute
// TODO: default page to 1
export const makeSermonListRouteVideo = withGuard(
	(languageRoute: string, page: number | string): string =>
		`/${languageRoute}/sermons/video/page/${page}`
);

// TODO: use makeSermonListRoute
// TODO: default page to 1
export const makeSermonListRouteAudio = withGuard(
	(languageRoute: string, page: number | string): string =>
		`/${languageRoute}/sermons/audio/page/${page}`
);

export const makeBibleListRoute = withGuard(
	(languageRoute: string): string => `/${languageRoute}/bibles`
);

export const makeBibleVersionRoute = withGuard(
	(languageRoute: string, versionId: string): string =>
		`/${languageRoute}/bibles/${versionId}`
);

export const makeBibleBookRoute = withGuard(
	(languageRoute: string, bookId: string): string =>
		`/${languageRoute}/bibles/${bookId.replace('-', '/')}`
);

// TODO: rename to makeAudiobookDetailRoute
export const makeAudiobookRoute = withGuard(
	(languageRoute: string, bookId: string): string =>
		`/${languageRoute}/books/${bookId}`
);

export const makeAudiobookListRoute = withGuard(
	(languageRoute: string, page: number | string): string =>
		`/${languageRoute}/books/page/${page}`
);

// TODO: rename to makeStoryDetailPage
export const makeStoryRoute = withGuard(
	(languageRoute: string, storyId: string): string =>
		`/${languageRoute}/stories/${storyId}`
);

export const makeStoryListPage = withGuard(
	(languageRoute: string, page: number | string): string =>
		`/${languageRoute}/stories/page/${page}`
);

export const makeSongsListRoute = withGuard(
	(languageRoute: string): string => `/${languageRoute}/songs`
);

export const makeAlbumRoute = withGuard(
	(languageRoute: string, albumId: string): string =>
		`/${languageRoute}/songs/album/${albumId}`
);

export const makeBibleMusicRoute = withGuard(
	(languageRoute: string, bookName: string): string =>
		`/${languageRoute}/songs/book/${slug(bookName)}`
);

export const makeSponsorMusicRoute = withGuard(
	(languageRoute: string, sponsorId: string): string =>
		`/${languageRoute}/songs/sponsor/${sponsorId}`
);

export const makeTagMusicRoute = withGuard(
	(languageRoute: string, tagName: string): string =>
		`/${languageRoute}/songs/tag/${slug(tagName)}`
);

export const makeConferenceRoute = withGuard(
	(
		languageRoute: string,
		conferenceId: string,
		page: number | string = 1
	): string => `/${languageRoute}/conferences/${conferenceId}/page/${page}`
);

export const makeConferenceListRoute = withGuard(
	(languageRoute: string, page: number | string): string =>
		`/${languageRoute}/conferences/page/${page}`
);

// TODO: rename makeSponsorDetailRoute
export const makeSponsorRoute = withGuard(
	(languageRoute: string, sponsorId: string): string =>
		`/${languageRoute}/sponsors/${sponsorId}`
);

export const makeSponsorListRoute = withGuard(
	(languageRoute: string, page: number | string): string =>
		`/${languageRoute}/sponsors/page/${page}`
);

export const makeSponsorTeachingsRoute = withGuard(
	(
		languageRoute: string,
		sponsorId: string,
		page: number | string = 1
	): string => `/${languageRoute}/sponsors/${sponsorId}/teachings/page/${page}`
);

export const makeSponsorBooksRoute = withGuard(
	(
		languageRoute: string,
		sponsorId: string,
		page: number | string = 1
	): string => `/${languageRoute}/sponsors/${sponsorId}/books/page/${page}`
);

export const makeSponsorAlbumsRoute = withGuard(
	(
		languageRoute: string,
		sponsorId: string,
		page: number | string = 1
	): string => `/${languageRoute}/sponsors/${sponsorId}/albums/page/${page}`
);

export const makeSponsorConferencesRoute = withGuard(
	(
		languageRoute: string,
		sponsorId: string,
		page: number | string = 1
	): string =>
		`/${languageRoute}/sponsors/${sponsorId}/conferences/page/${page}`
);

export const makeSponsorSeriesRoute = withGuard(
	(
		languageRoute: string,
		sponsorId: string,
		page: number | string = 1
	): string => `/${languageRoute}/sponsors/${sponsorId}/series/page/${page}`
);

export const makeTestimoniesRoute = withGuard(
	(languageRoute: string, page: number | string): string =>
		`/${languageRoute}/testimonies/page/${page}`
);

export const makePlaylistListRoute = withGuard(
	(languageRoute: string, page: number | string): string =>
		`/${languageRoute}/playlists/page/${page}`
);

export const makePlaylistDetailRoute = withGuard(
	(
		languageRoute: string,
		playlistId: string,
		page: number | string = 1
	): string => `/${languageRoute}/playlists/${playlistId}/page/${page}`
);

export const makeBlogPostRoute = withGuard(
	(languageRoute: string, blogPostId: string): string =>
		`/${languageRoute}/blog/${blogPostId}`
);

export const makeBlogPostListRoute = withGuard(
	(languageRoute: string, page: number | string): string =>
		`/${languageRoute}/blog/page/${page}`
);
