import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function listRepositories(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const project = this.getNodeParameter('project', index) as string;

  return {
    method: 'GET',
    endpoint: `/${project}/_apis/git/repositories?api-version=7.1`,
  };
}
