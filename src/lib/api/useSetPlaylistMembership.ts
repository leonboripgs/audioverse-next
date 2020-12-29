import { useMutation, useQueryClient } from 'react-query';

import { setPlaylistMembership } from '@lib/api/setPlaylistMembership';

interface MutateVariables {
	recordingId: string;
	playlistId: string;
	add: boolean;
}

export function useSetPlaylistMembership(): (
	recordingId: string,
	playlistId: string,
	add: boolean
) => void {
	const queryClient = useQueryClient();
	const { mutate } = useMutation(
		(variables: MutateVariables): Promise<boolean> => {
			const { recordingId, playlistId, add } = variables;
			return setPlaylistMembership(recordingId, playlistId, add);
		},
		{
			onSettled: async () => {
				await queryClient.invalidateQueries('playlists');
			},
		}
	);

	return (recordingId: string, playlistId: string, add: boolean) =>
		mutate({ recordingId, playlistId, add });
}
