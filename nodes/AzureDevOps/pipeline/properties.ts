import { INodeProperties } from 'n8n-workflow';

export const pipelineProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['pipeline'],
      },
    },
    options: [
      {
        name: 'Run',
        value: 'run',
        description: 'Run a pipeline',
        action: 'Run a pipeline',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List pipelines',
        action: 'List pipelines',
      },
    ],
    default: 'list',
  },
  {
    displayName: 'Pipeline ID',
    name: 'pipelineId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['pipeline'],
        operation: ['run'],
      },
    },
    default: '',
    required: true,
    description: 'The ID of the pipeline to run',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['pipeline'],
        operation: ['run'],
      },
    },
    options: [
      {
        displayName: 'Branch',
        name: 'branch',
        type: 'string',
        default: '',
        description: 'The branch to run the pipeline on (e.g., refs/heads/main)',
      },
      {
        displayName: 'Variables (JSON)',
        name: 'variables',
        type: 'json',
        default: '',
        description: 'Pipeline variables as JSON object',
      },
    ],
  },
];
