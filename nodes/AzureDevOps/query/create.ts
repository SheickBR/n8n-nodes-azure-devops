import { IRequestOptions } from '../../types';

export function createQuery(project: string, parentPath: string, queryName: string, wiql: string): IRequestOptions {
  return {
    method: 'POST',
    endpoint: `/${project}/_apis/wit/queries/${parentPath}?api-version=7.1-preview.2`,
    body: { name: queryName, wiql },
    headers: {},
  };
}
