import { IRequestOptions } from '../../types';

export function listWorkItems(ids: string, expand?: string, fields?: string, asOf?: string): IRequestOptions {
  let endpoint = '/_apis/wit/workitems?api-version=7.1-preview.3';
  endpoint += `&ids=${ids}`;
  if (expand) endpoint += `&$expand=${expand}`;
  if (fields) endpoint += `&fields=${fields}`;
  if (asOf) endpoint += `&asOf=${asOf}`;

  return {
    method: 'GET',
    endpoint,
    body: {},
    headers: {},
  };
}
