import { IRequestOptions } from '../../types';
import { WorkItemUpdate } from '../shared/interfaces';

export function createWorkItem(project: string, workItemType: string, data: WorkItemUpdate[]): IRequestOptions {
  return {
    method: 'POST',
    endpoint: `/${project}/_apis/wit/workitems/$${workItemType}?api-version=7.1-preview.3`,
    body: data,
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
  };
}
