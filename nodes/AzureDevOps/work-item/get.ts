import { IRequestOptions } from '../../types';

export function getWorkItem(project: string, id: string, expand?: string, fields?: string, asOf?: string): IRequestOptions {
  let endpoint = `/${project}/_apis/wit/workitems/${id}?api-version=7.1-preview.3`;
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
