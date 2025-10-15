import { INodeProperties } from 'n8n-workflow';

export const buildProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['build'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Queue a new build',
        action: 'Create a build',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a build',
        action: 'Get a build',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List builds',
        action: 'List builds',
      },
    ],
    default: 'list',
  },
  {
    displayName: 'Build Definition ID',
    name: 'definitionId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['build'],
        operation: ['create'],
      },
    },
    default: '',
    required: true,
    description: 'The ID of the build definition',
  },
  {
    displayName: 'Build ID',
    name: 'buildId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['build'],
        operation: ['get'],
      },
    },
    default: '',
    required: true,
    description: 'The ID of the build',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['build'],
        operation: ['list'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['build'],
        operation: ['list'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
    },
    default: 50,
    description: 'Max number of results to return',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['build'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Source Branch',
        name: 'sourceBranch',
        type: 'string',
        default: '',
        description: 'The branch to build (e.g., refs/heads/main)',
      },
      {
        displayName: 'Source Version',
        name: 'sourceVersion',
        type: 'string',
        default: '',
        description: 'The commit ID to build',
      },
      {
        displayName: 'Parameters (JSON)',
        name: 'parameters',
        type: 'json',
        default: '',
        description: 'Build parameters as JSON object',
      },
    ],
  },
];
