import {
	IHookFunctions,
	IWebhookFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeOperationError,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';
import { apiRequest } from '../transport';
import { getProjects } from './project/options';

type SupportedEvent =
	| 'workItemCreated'
	| 'workItemUpdated'
	| 'pullRequestCreated'
	| 'pullRequestMerged'
	| 'pullRequestAbandoned'
	| 'buildCompleted'
	| 'releaseCreated'
	| 'releaseDeploymentCompleted';

const eventTypeMap: Record<SupportedEvent, string> = {
	workItemCreated: 'workitem.created',
	workItemUpdated: 'workitem.updated',
	pullRequestCreated: 'git.pullrequest.created',
	pullRequestMerged: 'git.pullrequest.merged',
	pullRequestAbandoned: 'git.pullrequest.abandoned',
	buildCompleted: 'build.complete',
	releaseCreated: 'ms.vss-release.release-created-event',
	releaseDeploymentCompleted: 'ms.vss-release.deployment-completed-event',
};

export class AzureDevOpsTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Azure DevOps Trigger',
		name: 'azureDevOpsTrigger',
		icon: 'file:../azureDevOps.svg',
		group: ['trigger'],
		version: 1,
		description: 'Listen to Azure DevOps Service Hooks events',
		defaults: {
			name: 'Azure DevOps Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [{ name: 'azureDevOpsApi', required: true }],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'azureDevOps',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Build Completed', value: 'buildCompleted' },
					{ name: 'Pull Request Abandoned', value: 'pullRequestAbandoned' },
					{ name: 'Pull Request Created', value: 'pullRequestCreated' },
					{ name: 'Pull Request Merged', value: 'pullRequestMerged' },
					{ name: 'Release Created', value: 'releaseCreated' },
					{ name: 'Release Deployment Completed', value: 'releaseDeploymentCompleted' },
					{ name: 'Work Item Created', value: 'workItemCreated' },
					{ name: 'Work Item Updated', value: 'workItemUpdated' },
				],
				default: 'workItemUpdated',
				description: 'Azure DevOps event to subscribe to',
			},
			{
				displayName: 'Project Name or ID',
				name: 'project',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getProjects',
				},
				default: '',
				required: true,
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Repository Name or ID',
				name: 'repository',
				type: 'options',
				displayOptions: {
					show: {
						event: ['pullRequestCreated', 'pullRequestMerged', 'pullRequestAbandoned'],
					},
				},
				typeOptions: {
					loadOptionsMethod: 'getRepositories',
					loadOptionsDependsOn: ['project'],
				},
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Target Branch Name or ID',
				name: 'targetBranch',
				type: 'options',
				displayOptions: {
					show: {
						event: ['pullRequestCreated', 'pullRequestMerged', 'pullRequestAbandoned'],
					},
				},
				typeOptions: {
					loadOptionsMethod: 'getBranches',
					loadOptionsDependsOn: ['project', 'repository'],
				},
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Advanced',
				name: 'advanced',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Additional Filters (JSON)',
						name: 'additionalFilters',
						type: 'json',
						default: '',
						placeholder: '{\n    "areaPath": "MyProject\\\\MyArea"\n}',
						description: 'Optional: Specify additional publisher inputs as a JSON object. See Azure DevOps docs for available filters for your event type.',
						typeOptions: {
							rows: 5,
						},
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			getProjects,
			getRepositories: async function (this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const project = this.getNodeParameter('project', 0) as string;
				if (!project) return [];
				const response = await apiRequest.call(this, 'GET', `/${project}/_apis/git/repositories?api-version=7.1-preview.1`, {});
				return response.value.map((repo: any) => ({ name: repo.name, value: repo.id }));
			},
			getBranches: async function (this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const project = this.getNodeParameter('project', 0) as string;
				const repository = this.getNodeParameter('repository', 0) as string;
				if (!project || !repository) return [];
				const response = await apiRequest.call(this, 'GET', `/${project}/_apis/git/repositories/${repository}/refs?filter=heads/&api-version=7.1-preview.1`, {});
				return response.value.map((branch: any) => ({ name: branch.name.replace('refs/heads/', ''), value: branch.name }));
			},
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const staticData = this.getWorkflowStaticData('node') as any;

				if (!staticData.subscriptionId) {
					return false;
				}

				try {
					const subscription = await apiRequest.call(
						this,
						'GET',
						`/_apis/hooks/subscriptions/${staticData.subscriptionId}?api-version=7.1-preview.1`,
						{},
						{},
					);

					if (subscription && subscription.status === 'enabled' && subscription.consumerInputs?.url === webhookUrl) {
						return true;
					}

					delete staticData.subscriptionId;
					delete staticData.webhookUrl;
					return false;
				} catch (error) {
					delete staticData.subscriptionId;
					delete staticData.webhookUrl;
					return false;
				}
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event', 0) as SupportedEvent;
				const projectNameOrId = this.getNodeParameter('project', 0) as string;
				const repository = this.getNodeParameter('repository', 0, undefined) as string;
				const targetBranch = this.getNodeParameter('targetBranch', 0, undefined) as string;
				const advanced = this.getNodeParameter('advanced', 0, {}) as { additionalFilters?: string | object };

				if (!webhookUrl) {
					throw new NodeOperationError(
						this.getNode(),
						'Webhook URL could not be determined. Please ensure the workflow is saved and active.',
						{ itemIndex: 0 }
					);
				}

				if (!webhookUrl.startsWith('http://') && !webhookUrl.startsWith('https://')) {
					throw new NodeOperationError(
						this.getNode(),
						'Webhook URL must be a valid HTTP or HTTPS URL that Azure DevOps can access.',
						{ itemIndex: 0 }
					);
				}

				let projectId = projectNameOrId;

				try {
					const projectResponse = await apiRequest.call(
						this,
						'GET',
						`/_apis/projects/${projectNameOrId}?api-version=7.1`,
						{},
						{},
					);

					if (projectResponse && projectResponse.id) {
						projectId = projectResponse.id;
					}
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Failed to get project details. Please verify the project exists and you have access to it.`,
						{ itemIndex: 0 }
					);
				}

				const publisherInputs: Record<string, any> = {
					projectId,
				};

				if (event.startsWith('pullRequest')) {
					if (repository) {
						publisherInputs.repository = repository;
					}
					if (targetBranch) {
						publisherInputs.branch = targetBranch;
					}
				}

				if (advanced.additionalFilters) {
					try {
						const parsedFilters = typeof advanced.additionalFilters === 'string'
							? JSON.parse(advanced.additionalFilters)
							: advanced.additionalFilters;
						Object.assign(publisherInputs, parsedFilters);
					} catch (error) {
						throw new NodeOperationError(
							this.getNode(),
							'Additional Filters JSON is not valid.',
							{ itemIndex: 0 }
						);
					}
				}

				const subscriptionBody = {
					publisherId: 'tfs',
					eventType: eventTypeMap[event],
					resourceVersion: '1.0',
					consumerId: 'webHooks',
					consumerActionId: 'httpRequest',
					publisherInputs,
					consumerInputs: {
						url: webhookUrl,
					},
				};

				try {
					const response = await apiRequest.call(
						this,
						'POST',
						'/_apis/hooks/subscriptions?api-version=7.1-preview.1',
						subscriptionBody,
						{ 'Content-Type': 'application/json' },
					);

					if (!response || !response.id) {
						throw new NodeOperationError(
							this.getNode(),
							'Failed to create service hook subscription. The Azure DevOps API did not return a subscription ID.',
							{ itemIndex: 0 }
						);
					}

					const staticData = this.getWorkflowStaticData('node') as any;
					staticData.subscriptionId = response.id;
					staticData.webhookUrl = webhookUrl;

					return true;
				} catch (error: any) {
					let errorMessage = error.message || 'Unknown error occurred';
					let detailedInfo = '';

					if (error.response?.body) {
						const responseBody = error.response.body;
						if (typeof responseBody === 'object') {
							errorMessage = responseBody.message || errorMessage;
							if (responseBody.typeKey) {
								detailedInfo = `\nError Type: ${responseBody.typeKey}`;
							}
							if (responseBody.errorCode) {
								detailedInfo += `\nError Code: ${responseBody.errorCode}`;
							}
						} else if (typeof responseBody === 'string') {
							try {
								const parsed = JSON.parse(responseBody);
								errorMessage = parsed.message || errorMessage;
							} catch {
								errorMessage = responseBody;
							}
						}
					}

					const troubleshootingSteps = [
						'\n\nTroubleshooting steps:',
						'1. Verify your PAT has "Service Hooks (Read & manage)" scope',
						'2. Ensure the webhook URL is publicly accessible (Azure DevOps must reach it)',
						'3. Check if you have permissions to create service hooks in the project',
						'4. Verify the organization URL in credentials is correct',
						`5. Current webhook URL: ${webhookUrl}`,
					].join('\n');

					throw new NodeOperationError(
						this.getNode(),
						`Failed to create Azure DevOps service hook: ${errorMessage}${detailedInfo}${troubleshootingSteps}`,
						{ itemIndex: 0 }
					);
				}
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node') as any;

				if (!staticData.subscriptionId) {
					return true;
				}

				try {
					await apiRequest.call(
						this,
						'DELETE',
						`/_apis/hooks/subscriptions/${staticData.subscriptionId}?api-version=7.1`,
						{},
						{},
					);

					delete staticData.subscriptionId;
					delete staticData.webhookUrl;

					return true;
				} catch (error) {
					return false;
				}
			},
		},
	};

	// Handle incoming webhook calls from Azure DevOps
	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const headers = this.getHeaderData();
		const body = this.getBodyData();

		const item: INodeExecutionData = {
			json: {
				headers,
				body,
			},
		};

		return {
			workflowData: [this.helpers.returnJsonArray([item.json])],
		};
	}
}
