import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function listPullRequests(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
	const project = this.getNodeParameter('project', index) as string;
	const repositoryId = this.getNodeParameter('repositoryId', index) as string;
	const options = this.getNodeParameter('options', index) as {
		creatorId?: string;
		includeWorkItemRefs?: boolean;
		reviewerId?: string;
		sourceRefName?: string;
		status?: string;
		targetRefName?: string;
	};

	const qs: { [key: string]: string | boolean } = {};
	if (options) {
		if (options.creatorId) qs['searchCriteria.creatorId'] = options.creatorId;
		if (options.includeWorkItemRefs) qs['searchCriteria.includeWorkItemRefs'] = options.includeWorkItemRefs;
		if (options.reviewerId) qs['searchCriteria.reviewerId'] = options.reviewerId;
		if (options.sourceRefName) qs['searchCriteria.sourceRefName'] = options.sourceRefName;
		if (options.status) qs['searchCriteria.status'] = options.status;
		if (options.targetRefName) qs['searchCriteria.targetRefName'] = options.targetRefName;
	}

	const endpoint = repositoryId
		? `/${project}/_apis/git/repositories/${repositoryId}/pullrequests?api-version=7.1`
		: `/${project}/_apis/git/pullrequests?api-version=7.1`;

	return {
		method: 'GET',
		endpoint,
		qs,
	};
}
