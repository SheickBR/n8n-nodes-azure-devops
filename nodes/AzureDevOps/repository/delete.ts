import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function deleteRepository(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const project = this.getNodeParameter('project', index) as string;
  const repositoryId = this.getNodeParameter('repositoryId', index) as string;

  return {
    method: 'DELETE',
    endpoint: `/${project}/_apis/git/repositories/${repositoryId}?api-version=7.1`,
  };
}
