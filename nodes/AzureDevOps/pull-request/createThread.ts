import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function createThread(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const project = this.getNodeParameter('project', index) as string;
  const repositoryId = this.getNodeParameter('repositoryId', index) as string;
  const pullRequestId = this.getNodeParameter('pullRequestId', index) as string;

  return {
    method: 'POST',
    endpoint: `/${project}/_apis/git/repositories/${repositoryId}/pullRequests/${pullRequestId}/threads?api-version=7.1`,
  };
}
