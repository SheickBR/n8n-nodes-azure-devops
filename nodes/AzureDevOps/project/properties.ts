import { INodeProperties } from 'n8n-workflow';

export const projectProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['project'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create a project' },
      { name: 'Delete', value: 'delete', action: 'Delete a project' },
      { name: 'Get', value: 'get', action: 'Get a project' },
      { name: 'List', value: 'list', action: 'List projects' },
      { name: 'Update', value: 'update', action: 'Update a project' },
    ],
    default: 'get',
  },

  // CREATE
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
    description: 'Project name',
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    default: '',
    typeOptions: { rows: 3 },
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Visibility',
    name: 'visibility',
    type: 'options',
    options: [
      { name: 'Private', value: 'private' },
      { name: 'Public', value: 'public' },
    ],
    default: 'private',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Source Control',
    name: 'sourceControlType',
    type: 'options',
    options: [
      { name: 'Git', value: 'Git' },
      { name: 'TFVC', value: 'Tfvc' },
    ],
    default: 'Git',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
    description: 'Version control for the new project',
  },
  {
    displayName: 'Process Template Name or ID',
    name: 'processTemplateId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getProcesses',
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },

  // GET/DELETE/UPDATE target
  {
    displayName: 'Project Name or ID',
    name: 'targetProjectId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getProjects',
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['get', 'delete', 'update'],
      },
    },
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },

  // UPDATE fields
  {
    displayName: 'Name',
    name: 'updateName',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Description',
    name: 'updateDescription',
    type: 'string',
    default: '',
    typeOptions: { rows: 3 },
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Visibility',
    name: 'updateVisibility',
    type: 'options',
    options: [
      { name: 'Private', value: 'private' },
      { name: 'Public', value: 'public' },
    ],
    default: 'private',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'State',
    name: 'updateState',
    type: 'options',
    options: [
      { name: 'Create Pending', value: 'createPending' },
      { name: 'Deleting', value: 'deleting' },
      { name: 'New', value: 'new' },
      { name: 'Well Formed', value: 'wellFormed' },
    ],
    default: 'wellFormed',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['update'],
      },
    },
  },
];
