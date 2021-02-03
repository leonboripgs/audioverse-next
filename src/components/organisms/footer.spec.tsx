import Footer from '@components/organisms/footer';
import { renderWithIntl } from '@lib/test/helpers';

describe('footer', () => {
	it('has site links', async () => {
		const links = [
			'About Us',
			'Meet the Team',
			'Spirit of AudioVerse',
			'FAQ',
			'Contact Us',
			'Presentations',
			'Bibles',
			'Books',
			'Stories',
			'Scripture Songs',
			'Conferences',
			'Presenters',
			'Tags',
			'Sponsors',
			'Series',
			'Testimonials',
			'Playlists',
			'Blog',
			'AudioVerse Store',
			'Journeys Unscripted',
			'Deutsch',
			'English',
			'Español',
			'Français',
			'日本語',
			'中文',
			'Русский',
		];

		const { getByRole } = await renderWithIntl(Footer, {});

		links.map((name) => {
			expect(getByRole('link', { name })).toBeInTheDocument();
		});
	});
});
