import { render } from '@testing-library/react';
import React from 'react';

import { getSermonCount, getSermons } from '@lib/api';
import { loadRouter, loadSermons } from '@lib/test/helpers';
import { getStaticPaths } from '@pages/[language]/sermons/audio/page/[i]';
import SermonList, {
	getStaticProps,
} from '@pages/[language]/sermons/audio/page/[i]';

jest.mock('@lib/api');
jest.mock('@lib/api/fetchApi');

const renderPage = async ({ params = { i: '1', language: 'en' } } = {}) => {
	const { props } = await getStaticProps({ params });
	return render(<SermonList {...props} />);
};

describe('sermon audio list page', () => {
	it('gets audio count', async () => {
		await getStaticPaths();

		expect(getSermonCount).toBeCalledWith('ENGLISH', { hasVideo: false });
	});

	it('gets audio filtered sermons', async () => {
		loadSermons();

		await renderPage({
			params: {
				i: '1',
				language: 'en',
			},
		});

		expect(getSermons).toBeCalledWith('ENGLISH', {
			hasVideo: false,
			first: 25,
			offset: 0,
		});
	});

	it('links to feed', async () => {
		loadSermons();
		loadRouter({ pathname: '/[language]/sermons/audio/page/[i]' });

		const { getByRole } = await renderPage();

		expect(getByRole('link', { name: 'RSS' })).toHaveAttribute(
			'href',
			'/en/sermons/audio.xml'
		);
	});
});
