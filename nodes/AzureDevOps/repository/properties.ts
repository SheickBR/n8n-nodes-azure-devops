import { INodeProperties } from 'n8n-workflow';

export const repositoryProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['repository'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a repository',
        action: 'Create a repository',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a repository',
        action: 'Delete a repository',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a repository',
        action: 'Get a repository',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List repositories',
        action: 'List repositories',
      },
    ],
    default: 'list',
  },
  {
    displayName: 'Repository ID',
    name: 'repositoryId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['repository'],
        operation: ['get', 'delete'],
      },
    },
    default: '',
    required: true,
    description: 'The ID of the repository',
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['repository'],
        operation: ['create'],
      },
    },
    default: '',
    required: true,
    description: 'The name of the repository',
  },
];
