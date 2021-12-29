import * as Types from '../../lib/generated/graphql';

import { PresenterPivotFragmentDoc } from './pivot.generated';
import { CardCollectionFragmentDoc } from '../../components/molecules/card/collection.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { graphqlFetcher } from '@lib/api/fetchApi';
export type GetPresenterAppearsPageDataQueryVariables = Types.Exact<{
	language: Types.Language;
	id: Types.Scalars['ID'];
	offset: Types.InputMaybe<Types.Scalars['Int']>;
	first: Types.InputMaybe<Types.Scalars['Int']>;
}>;

export type GetPresenterAppearsPageDataQuery = {
	__typename?: 'Query';
	person:
		| {
				__typename?: 'Person';
				id: string | number;
				name: string;
				canonicalPath: string;
				imageWithFallback: { __typename?: 'Image'; url: string };
		  }
		| null
		| undefined;
	collections: {
		__typename?: 'CollectionConnection';
		nodes:
			| Array<{
					__typename?: 'Collection';
					id: string | number;
					canonicalPath: string;
					title: string;
					startDate: string | null | undefined;
					endDate: string | null | undefined;
					duration: number;
					collectionContentType: Types.CollectionContentType;
					image:
						| { __typename?: 'Image'; id: string | number; url: string }
						| null
						| undefined;
					allSequences: {
						__typename?: 'SequenceConnection';
						aggregate:
							| { __typename?: 'Aggregate'; count: number }
							| null
							| undefined;
					};
					allRecordings: {
						__typename?: 'RecordingConnection';
						aggregate:
							| { __typename?: 'Aggregate'; count: number }
							| null
							| undefined;
					};
			  }>
			| null
			| undefined;
		aggregate: { __typename?: 'Aggregate'; count: number } | null | undefined;
	};
};

export const GetPresenterAppearsPageDataDocument = `
    query getPresenterAppearsPageData($language: Language!, $id: ID!, $offset: Int, $first: Int) {
  person(id: $id) {
    id
    ...presenterPivot
  }
  collections(
    language: $language
    offset: $offset
    first: $first
    persons: [{personId: $id, role: SPEAKER}]
    orderBy: [{field: RECORDING_PUBLISHED_AT, direction: DESC}]
  ) {
    nodes {
      ...cardCollection
    }
    aggregate {
      count
    }
  }
}
    ${PresenterPivotFragmentDoc}
${CardCollectionFragmentDoc}`;
export const useGetPresenterAppearsPageDataQuery = <
	TData = GetPresenterAppearsPageDataQuery,
	TError = unknown
>(
	variables: GetPresenterAppearsPageDataQueryVariables,
	options?: UseQueryOptions<GetPresenterAppearsPageDataQuery, TError, TData>
) =>
	useQuery<GetPresenterAppearsPageDataQuery, TError, TData>(
		['getPresenterAppearsPageData', variables],
		graphqlFetcher<
			GetPresenterAppearsPageDataQuery,
			GetPresenterAppearsPageDataQueryVariables
		>(GetPresenterAppearsPageDataDocument, variables),
		options
	);
import { fetchApi } from '@lib/api/fetchApi';

export async function getPresenterAppearsPageData<T>(
	variables: ExactAlt<T, GetPresenterAppearsPageDataQueryVariables>
): Promise<GetPresenterAppearsPageDataQuery> {
	return fetchApi(GetPresenterAppearsPageDataDocument, { variables });
}
