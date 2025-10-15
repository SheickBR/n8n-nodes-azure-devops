import { INodeProperties } from 'n8n-workflow';

export const releaseProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['release'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a release',
        action: 'Create a release',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List releases',
        action: 'List releases',
      },
    ],
    default: 'list',
  },
  {
    displayName: 'Release Definition ID',
    name: 'definitionId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['release'],
        operation: ['create'],
      },
    },
    default: '',
    required: true,
    description: 'The ID of the release definition',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['release'],
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
        resource: ['release'],
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
        resource: ['release'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the release',
      },
      {
        displayName: 'Artifacts (JSON)',
        name: 'artifacts',
        type: 'json',
        default: '',
        description: 'Release artifacts as JSON array',
      },
    ],
  },
];
