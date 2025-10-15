import { INodeProperties } from 'n8n-workflow';

export const userProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['user'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Add a user, assign license and extensions and make them a member of a project group',
        action: 'Create a user entitlement',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a user entitlement',
        action: 'Delete a user entitlement',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a user entitlement',
        action: 'Get a user entitlement',
      },
      {
        name: 'List',
        value: 'list',
        description: 'Get a paged set of user entitlements',
        action: 'List user entitlements',
      },
    ],
    default: 'list',
  },
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['get', 'delete'],
      },
    },
    default: '',
    required: true,
    description: 'The user entitlement ID',
  },
  {
    displayName: 'Principal Name',
    name: 'principalName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    default: '',
    required: true,
    description: 'The principal name (email) of the user',
  },
  {
    displayName: 'Access Level',
    name: 'accessLevel',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    options: [
      {
        name: 'Basic',
        value: 'express',
      },
      {
        name: 'Basic + Test Plans',
        value: 'advanced',
      },
      {
        name: 'Stakeholder',
        value: 'stakeholder',
      },
      {
        name: 'Visual Studio Enterprise',
        value: 'enterprise',
      },
      {
        name: 'Visual Studio Professional',
        value: 'professional',
      },
    ],
    default: 'express',
    required: true,
    description: 'The access level to assign to the user',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create', 'list'],
      },
    },
    options: [
      {
        displayName: 'Continuation Token',
        name: 'continuationToken',
        type: 'string',
        typeOptions: {
          password: true,
        },
        displayOptions: {
          show: {
            '/operation': ['list'],
          },
        },
        default: '',
        description: 'Continuation token for getting the next page of data',
      },
      {
        displayName: 'Filter',
        name: 'filter',
        type: 'string',
        displayOptions: {
          show: {
            '/operation': ['list'],
          },
        },
        default: '',
        description: 'Filter expression for user entitlements',
        placeholder: "name eq 'test'",
      },
      {
        displayName: 'Group Assignments',
        name: 'groupAssignments',
        type: 'json',
        displayOptions: {
          show: {
            '/operation': ['create'],
          },
        },
        default: '',
        description: 'Group assignments for the user as JSON array',
      },
      {
        displayName: 'Order By',
        name: 'orderBy',
        type: 'string',
        displayOptions: {
          show: {
            '/operation': ['list'],
          },
        },
        default: '',
        description: 'Property name and order to sort by',
        placeholder: 'lastAccessed desc',
      },
      {
        displayName: 'Project Entitlements',
        name: 'projectEntitlements',
        type: 'json',
        displayOptions: {
          show: {
            '/operation': ['create'],
          },
        },
        default: '',
        description: 'Project entitlements for the user as JSON array',
        // eslint-disable-next-line n8n-nodes-base/node-param-placeholder-miscased-id
        placeholder: '[{"group":{"groupType":"projectContributor"},"projectRef":{"ID":"project-id"}}]',

      },
      {
        displayName: 'Select',
        name: 'select',
        type: 'string',
        displayOptions: {
          show: {
            '/operation': ['list'],
          },
        },
        default: '',
        description: 'Comma-separated list of properties to select',
        placeholder: 'Projects,Extensions,GroupRules',
      },
    ],
  },
];
