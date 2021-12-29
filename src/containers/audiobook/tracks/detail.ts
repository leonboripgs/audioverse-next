import withFailStates from '@components/HOCs/withFailStates';
import { Recording } from '@components/organisms/recording';
import type { GetAudiobookTrackDetailDataQuery } from '@lib/generated/graphql';

export interface AudiobookTrackDetailProps {
	recording: GetAudiobookTrackDetailDataQuery['audiobookTrack'];
}

export default withFailStates<AudiobookTrackDetailProps>(
	Recording,
	(props) => !props.recording
);
