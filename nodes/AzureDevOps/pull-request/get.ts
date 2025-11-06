import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function getPullRequest(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
	const project = this.getNodeParameter('project', index) as string;
	const repositoryId = this.getNodeParameter('repositoryId', index) as string;
	const pullRequestId = this.getNodeParameter('pullRequestId', index) as number;

	const endpoint = repositoryId
		? `/${project}/_apis/git/repositories/${repositoryId}/pullrequests/${pullRequestId}?api-version=7.1`
		: `/${project}/_apis/git/pullrequests/${pullRequestId}?api-version=7.1`;

	return {
		method: 'GET',
		endpoint,
	};
}
