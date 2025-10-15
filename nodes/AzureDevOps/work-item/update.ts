import { IRequestOptions } from '../../types';
import { WorkItemUpdate } from '../shared/interfaces';

export function updateWorkItem(project: string, id: string, data: WorkItemUpdate[]): IRequestOptions {
  return {
    method: 'PATCH',
    endpoint: `/${project}/_apis/wit/workitems/${id}?api-version=7.1-preview.3`,
    body: data,
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
  };
}
