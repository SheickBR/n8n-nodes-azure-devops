import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function updatePullRequest(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
	const project = this.getNodeParameter('project', index) as string;
	const repositoryId = this.getNodeParameter('repositoryId', index) as string;
	const pullRequestId = this.getNodeParameter('pullRequestId', index) as number;
	const updateFields = this.getNodeParameter('updateFields', index) as {
		description?: string;
		status?: 'abandoned' | 'active' | 'completed';
		title?: string;
	};

	const body: { [key: string]: any } = {};
	if (updateFields.description) body.description = updateFields.description;
	if (updateFields.status) body.status = updateFields.status;
	if (updateFields.title) body.title = updateFields.title;

	return {
		method: 'PATCH',
		endpoint: `/${project}/_apis/git/repositories/${repositoryId}/pullrequests/${pullRequestId}?api-version=7.1`,
		body,
	};
}
