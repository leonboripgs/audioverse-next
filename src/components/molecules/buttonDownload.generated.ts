import * as Types from '../../lib/generated/graphql';

export type ButtonDownloadFragment = {
	__typename?: 'Recording';
	isDownloadAllowed: boolean;
	videoDownloads: Array<{
		__typename?: 'VideoFile';
		url: string;
		filesize: string;
		height: number;
		width: number;
	}>;
	audioDownloads: Array<{
		__typename?: 'AudioFile';
		url: string;
		filesize: string;
		bitrate: number;
	}>;
};

export const ButtonDownloadFragmentDoc = `
    fragment buttonDownload on Recording {
  isDownloadAllowed
  videoDownloads: videoFiles(allowedContainers: MP4) {
    url
    filesize
    height
    width
  }
  audioDownloads: audioFiles(allowedContainers: MP3) {
    url
    filesize
    bitrate
  }
}
    `;
