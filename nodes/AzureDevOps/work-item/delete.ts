import { IRequestOptions } from '../../types';

export function deleteWorkItem(project: string, id: string, destroy: boolean): IRequestOptions {
  const endpoint = `/${project}/_apis/wit/workitems/${id}?api-version=7.1-preview.3${destroy ? '&destroy=true' : ''}`;
  return {
    method: 'DELETE',
    endpoint,
    body: {},
    headers: {},
  };
}
