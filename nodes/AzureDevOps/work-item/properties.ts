import { ILoadOptionsFunctions, INodePropertyOptions, INodeProperties } from 'n8n-workflow';
import { apiRequest } from '../../transport';

export const workItemProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['workItem'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create a work item' },
      { name: 'Delete', value: 'delete', action: 'Delete a work item' },
      { name: 'Get', value: 'get', action: 'Get a work item' },
      { name: 'List', value: 'list', action: 'List work items' },
      { name: 'List Children', value: 'listChildren', action: 'List work item children' },
      { name: 'Update', value: 'update', action: 'Update a work item' },
    ],
    default: 'get',
  },
  {
    displayName: 'Work Item Type Name or ID',
    name: 'workItemType',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getWorkItemTypes',
      loadOptionsDependsOn: ['project'],
    },
    displayOptions: {
      show: {
        resource: ['workItem'],
        operation: ['create'],
      },
    },
    default: '',
    required: true,
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },
  {
    displayName: 'Required Fields Info',
    name: 'requiredFieldsNotice',
    type: 'notice',
    displayOptions: {
      show: {
        resource: ['workItem'],
        operation: ['create'],
        fieldsInputMode: ['ui'],
      },
    },
    default: '',
    description: 'After selecting a Work Item Type, required fields will be marked with an asterisk (*) in the Fields dropdown below. Make sure to fill all required fields.',
  },
  {
    displayName: 'Work Item ID',
    name: 'workItemId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['workItem'],
        operation: ['get', 'update', 'delete', 'listChildren'],
      },
    },
    default: '',
    required: true,
    description: 'The ID of the work item',
  },
  {
    displayName: 'Fields Input Mode',
    name: 'fieldsInputMode',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['workItem'],
        operation: ['create', 'update'],
      },
    },
    options: [
      { name: 'Fields UI', value: 'ui' },
      { name: 'JSON', value: 'json' },
    ],
    default: 'ui',
  },
  {
    displayName: 'Fields (JSON)',
    name: 'fieldsJson',
    type: 'json',
    displayOptions: {
      show: {
        resource: ['workItem'],
        operation: ['create', 'update'],
        fieldsInputMode: ['json'],
      },
    },
    default:
      '[\n  {\n    "op": "add",\n    "path": "/fields/System.Title",\n    "value": "My Work Item"\n  }\n]',
    description:
      'JSON array of patch operations. Format: [{"op": "add", "path": "/fields/FieldName", "value": "value"}].',
  },
  {
    displayName: 'Fields',
    name: 'fieldsUi',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    displayOptions: {
      show: {
        resource: ['workItem'],
        operation: ['create', 'update'],
        fieldsInputMode: ['ui'],
      },
    },
    default: {},
    placeholder: 'Add Field',
    options: [
      {
        name: 'fieldValues',
        displayName: 'Field',
        values: [
          {
            displayName: 'Field Name or ID',
            name: 'fieldName',
            type: 'options',
            typeOptions: {
              loadOptionsMethod: 'getWorkItemFields',
              loadOptionsDependsOn: ['project', 'workItemType'],
            },
            default: 'System.Title',
            description:
              'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
          },
        ],
      },
    ],
  },
  {
    displayName: 'Work Item IDs',
    name: 'workItemIds',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['workItem'],
        operation: ['list'],
      },
    },
    default: '',
    required: true,
    description:
      'Comma-separated list of work item IDs to retrieve (e.g., 1,2,3)',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['workItem'],
        operation: ['get', 'list'],
      },
    },
    options: [
      {
        displayName: 'Expand',
        name: 'expand',
        type: 'multiOptions',
        options: [
          { name: 'Relations', value: 'relations' },
          { name: 'Fields', value: 'fields' },
          { name: 'Links', value: 'links' },
          { name: 'All', value: 'all' },
        ],
        default: [],
        description: 'The expand parameters for work item attributes',
      },
      {
        displayName: 'Fields',
        name: 'fields',
        type: 'string',
        default: '',
        description:
          'Comma-separated list of fields to return (e.g., System.Title,Custom.FieldCreated)',
      },
      {
        displayName: 'As Of',
        name: 'asOf',
        type: 'dateTime',
        default: '',
        description: 'Get the work item as it existed at this time',
      },
    ],
  },
  {
    displayName: 'Destroy Permanently',
    name: 'destroy',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['workItem'],
        operation: ['delete'],
      },
    },
    default: false,
    description:
      'Whether to destroy the work item permanently or move it to the recycle bin',
  },
];

export async function getWorkItemTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  const project = this.getNodeParameter('project', 0) as string;

  try {
    const response = await apiRequest.call(
      this,
      'GET',
      `/${project}/_apis/wit/workitemtypes?api-version=7.1-preview.2`,
      {},
      {},
    );

    return response.value.map((type: any) => ({
      name: type.name,
      value: type.name,
    }));
  } catch (error) {
    return [
      { name: 'Bug', value: 'Bug' },
      { name: 'Epic', value: 'Epic' },
      { name: 'Feature', value: 'Feature' },
      { name: 'Issue', value: 'Issue' },
      { name: 'Task', value: 'Task' },
      { name: 'Test Case', value: 'Test Case' },
      { name: 'User Story', value: 'User Story' },
    ];
  }
}

export async function getWorkItemFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  const project = this.getNodeParameter('project', 0) as string;
  const workItemType = this.getNodeParameter('workItemType', 0) as string;

  if (!workItemType) {
    return [];
  }

  try {
    const projectResponse = await apiRequest.call(
      this,
      'GET',
      `/_apis/projects/${project}?api-version=7.1-preview.4`,
      {},
      {},
    );

    const processId = projectResponse.capabilities?.processTemplate?.templateTypeId;

    if (!processId) {
      throw new Error('Could not determine process template ID for project');
    }

    const workItemTypesResponse = await apiRequest.call(
      this,
      'GET',
      `/${project}/_apis/wit/workitemtypes?api-version=7.1-preview.2`,
      {},
      {},
    );

    const workItemTypeObj = workItemTypesResponse.value.find((wit: any) => wit.name === workItemType);
    const witRefName = workItemTypeObj?.referenceName || workItemType;

    const response = await apiRequest.call(
      this,
      'GET',
      `/_apis/work/processdefinitions/${processId}/workItemTypes/${witRefName}/fields?api-version=4.1-preview.1`,
      {},
      {},
    );

    const fields = response.value
      .filter((field: any) => !field.readOnly)
      .map((field: any) => ({
        name: field.required
          ? `* ${field.name} (Required)`
          : field.name,
        value: field.referenceName,
        required: field.required || false,
      }));

    const requiredFields = fields.filter((f: any) => f.required).sort((a: any, b: any) => a.name.localeCompare(b.name));
    const optionalFields = fields.filter((f: any) => !f.required).sort((a: any, b: any) => a.name.localeCompare(b.name));

    return [...requiredFields, ...optionalFields].map(({ name, value }) => ({ name, value }));
  } catch (error) {
    console.error('Error loading work item fields:', error);
    return [
      { name: '* Title (Required)', value: 'System.Title' },
      { name: 'Description', value: 'System.Description' },
      { name: 'Assigned To', value: 'System.AssignedTo' },
      { name: 'State', value: 'System.State' },
      { name: 'Area Path', value: 'System.AreaPath' },
      { name: 'Iteration Path', value: 'System.IterationPath' },
    ];
  }
}
