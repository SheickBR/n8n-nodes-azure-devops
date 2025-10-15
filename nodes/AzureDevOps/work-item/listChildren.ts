import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function listWorkItemChildren(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const project = this.getNodeParameter('project', index) as string;
  const workItemId = this.getNodeParameter('workItemId', index) as string;

  return {
    method: 'GET',
    endpoint: `/${project}/_apis/wit/workitems/${workItemId}?$expand=relations&api-version=7.1`,
  };
}
