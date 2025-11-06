import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function listThreads(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const project = this.getNodeParameter('project', index) as string;
  const repositoryId = this.getNodeParameter('repositoryId', index) as string;
  const pullRequestId = this.getNodeParameter('pullRequestId', index) as string;

  return {
    method: 'GET',
    endpoint: `/${project}/_apis/git/repositories/${repositoryId}/pullRequests/${pullRequestId}/threads?api-version=7.1`,
  };
}
