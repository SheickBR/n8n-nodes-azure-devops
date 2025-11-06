import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest } from '../transport';
import { workItemProperties, executeWorkItem, getWorkItemTypes, getWorkItemFields } from './work-item';
import { queryProperties, executeQuery, getQueries } from './query';
import { getProjects, getProcesses } from './project/options';
import { projectProperties, executeProject } from './project';
import { buildProperties, executeBuild } from './build';
import { pipelineProperties, executePipeline } from './pipeline';
import { releaseProperties, executeRelease } from './release';
import { repositoryProperties, executeRepository } from './repository';
import { pullRequestProperties, executePullRequest } from './pull-request';
import { userProperties, executeUser } from './user';
import { IRequestOptions } from '../types';

export class AzureDevOps implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Azure DevOps',
		name: 'azureDevOps',
		icon: 'file:../azureDevOps.svg',
		group: ['transform'],
		version: 2.0,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Interact with the Azure DevOps REST API',
		defaults: {
			name: 'Azure DevOps',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'azureDevOpsApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Build', value: 'build' },
					{ name: 'Pipeline', value: 'pipeline' },
					{ name: 'Project', value: 'project' },
					{ name: 'Pull Request', value: 'pullRequest' },
					{ name: 'Query', value: 'query' },
					{ name: 'Release', value: 'release' },
					{ name: 'Repository', value: 'repository' },
					{ name: 'User', value: 'user' },
					{ name: 'Work Item', value: 'workItem' },
				],
				default: 'workItem',
			},
			{
				displayName: 'Project Name or ID',
				name: 'project',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getProjects',
				},
				displayOptions: {
					show: {
						resource: ['workItem', 'query', 'build', 'pipeline', 'release', 'repository', 'pullRequest'],
					},
				},
				default: '',
				required: true,
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			...buildProperties,
			...pipelineProperties,
			...projectProperties,
			...pullRequestProperties,
			...queryProperties,
			...releaseProperties,
			...repositoryProperties,
			...userProperties,
			...workItemProperties,
		],
	};

	methods = {
		loadOptions: {
			getWorkItemTypes,
			getWorkItemFields,
			getProjects,
			getProcesses,
			getQueries,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				let requestOptions: IRequestOptions;

				switch (resource) {
					case 'build':
						requestOptions = await executeBuild.call(this, i);
						break;
					case 'pipeline':
						requestOptions = await executePipeline.call(this, i);
						break;
					case 'project':
						requestOptions = await executeProject.call(this, i);
						break;
					case 'query':
						requestOptions = await executeQuery.call(this, i);
						break;
					case 'release':
						requestOptions = await executeRelease.call(this, i);
						break;
					case 'repository':
						requestOptions = await executeRepository.call(this, i);
						break;
					case 'pullRequest':
						requestOptions = await executePullRequest.call(this, i);
						break;
					case 'user':
						requestOptions = await executeUser.call(this, i);
						break;
					case 'workItem':
						requestOptions = await executeWorkItem.call(this, i);
						break;
					default:
						throw new NodeOperationError(this.getNode(), `The resource '${resource}' is not supported.`, { itemIndex: i });
				}

				const response = await apiRequest.call(this, requestOptions.method, requestOptions.endpoint, requestOptions.body, requestOptions.headers, requestOptions.baseUrl);

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);

			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
