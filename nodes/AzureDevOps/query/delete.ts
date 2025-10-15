import { IRequestOptions } from '../../types';

export function deleteQuery(project: string, queryId: string): IRequestOptions {
  return {
    method: 'DELETE',
    endpoint: `/${project}/_apis/wit/queries/${queryId}?api-version=7.1-preview.2`,
    body: {},
    headers: {},
  };
}
