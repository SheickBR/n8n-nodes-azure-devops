import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { IRequestOptions } from '../../types';
import { createThread } from './createThread';
import { getPullRequest } from './get';
import { getDiff } from './getDiff';
import { getThread } from './getThread';
import { listPullRequests } from './list';
import { listThreads } from './listThreads';
import { updatePullRequest } from './update';
import { updateThread } from './updateThread';

export async function executePullRequest(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
	const operation = this.getNodeParameter('operation', index) as string;

	switch (operation) {
		case 'create-thread':
			return await createThread.call(this, index);
		case 'get':
			return await getPullRequest.call(this, index);
		case 'get-diff':
			return await getDiff.call(this, index);
		case 'get-thread':
			return await getThread.call(this, index);
		case 'list':
			return await listPullRequests.call(this, index);
		case 'list-threads':
			return await listThreads.call(this, index);
		case 'update':
			return await updatePullRequest.call(this, index);
		case 'update-thread':
			return await updateThread.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported for pull request resource.`, { itemIndex: index });
	}
}
