import { INodeProperties } from 'n8n-workflow';

export const pullRequestProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['pullRequest'],
			},
		},
		options: [
			{
				name: 'Create Thread',
				value: 'create-thread',
				description: 'Create a thread in a pull request',
				action: 'Create a thread in a pull request',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a pull request',
				action: 'Get a pull request',
			},
			{
				name: 'Get Diff',
				value: 'get-diff',
				description: 'Get the diff of a pull request',
				action: 'Get the diff of a pull request',
			},
			{
				name: 'Get Thread',
				value: 'get-thread',
				description: 'Get a thread in a pull request',
				action: 'Get a thread in a pull request',
			},
			{
				name: 'List',
				value: 'list',
				description: 'Retrieve all pull requests matching a specified criteria',
				action: 'List pull requests',
			},
			{
				name: 'List Threads',
				value: 'list-threads',
				description: 'List threads in a pull request',
				action: 'List threads in a pull request',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a pull request',
				action: 'Update a pull request',
			},
			{
				name: 'Update Thread',
				value: 'update-thread',
				description: 'Update a thread in a pull request',
				action: 'Update a thread in a pull request',
			},
		],
		default: 'list',
	},
	{
		displayName: 'Repository Name or ID',
		name: 'repositoryId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['pullRequest'],
				operation: ['get', 'list', 'update', 'get-diff', 'create-thread', 'update-thread', 'get-thread', 'list-threads'],
			},
		},
		default: '',
		description: 'The name or ID of the repository. If not provided, it will search across all repositories in the project.',
	},
	{
		displayName: 'Pull Request ID',
		name: 'pullRequestId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['pullRequest'],
				operation: ['get', 'update', 'create-thread', 'update-thread', 'get-thread', 'list-threads'],
			},
		},
		default: 0,
		required: true,
		description: 'The ID of the pull request',
	},
	{
		displayName: 'Thread ID',
		name: 'threadId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['pullRequest'],
				operation: ['get-thread', 'update-thread'],
			},
		},
		default: 0,
		required: true,
		description: 'The ID of the thread',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['pullRequest'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Creator ID',
				name: 'creatorId',
				type: 'string',
				default: '',
				description: 'ID of the pull request creator',
			},
			{
				displayName: 'Include Work Item Refs',
				name: 'includeWorkItemRefs',
				type: 'boolean',
				default: false,
				description: 'Whether to include work item references',
			},
			{
				displayName: 'Reviewer ID',
				name: 'reviewerId',
				type: 'string',
				default: '',
				description: 'ID of the reviewer',
			},
			{
				displayName: 'Source Ref Name',
				name: 'sourceRefName',
				type: 'string',
				default: '',
				description: 'The name of the source branch. E.g. refs/heads/feature/my-feature',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Abandoned', value: 'abandoned' },
					{ name: 'Active', value: 'active' },
					{ name: 'All', value: 'all' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Not Set', value: 'notSet' },
				],
				default: 'active',
				description: 'Status of the pull request',
			},
			{
				displayName: 'Target Ref Name',
				name: 'targetRefName',
				type: 'string',
				default: '',
				description: 'The name of the target branch. E.g. refs/heads/main',
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field to Update',
		default: {},
		displayOptions: {
			show: {
				resource: ['pullRequest'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'The description of the pull request (up to 4000 characters)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Abandoned', value: 'abandoned' },
					{ name: 'Active', value: 'active' },
					{ name: 'Completed', value: 'completed' },
				],
				default: 'active',
				description: 'The status of the pull request',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'The title of the pull request',
			},
		],
	},
];
