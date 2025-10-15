import { ILoadOptionsFunctions, INodePropertyOptions, INodeProperties } from 'n8n-workflow';
import { apiRequest } from '../../transport';

const flattenQueries = (items: any[], path = ''): INodePropertyOptions[] => {
  let queries: INodePropertyOptions[] = [];
  for (const item of items) {
    const currentPath = path ? `${path}/${item.name}` : item.name;
    if (item.isFolder) {
      if (item.children) {
        queries = queries.concat(flattenQueries(item.children, currentPath));
      }
    } else {
      queries.push({
        name: currentPath.replace('My Queries/', 'My Queries/').replace('Shared Queries/', 'Shared Queries/'),
        value: item.id,
      });
    }
  }
  return queries;
};

export async function getQueries(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  const project = this.getNodeParameter('project', 0) as string;
  let queries: INodePropertyOptions[] = [];

  try {
    const sharedQueriesResponse = await apiRequest.call(
      this,
      'GET',
      `/${project}/_apis/wit/queries/Shared Queries?$depth=2&api-version=7.1-preview.2`,
      {},
      {},
    );
    if (sharedQueriesResponse.children) {
      queries = queries.concat(flattenQueries(sharedQueriesResponse.children, 'Shared Queries'));
    }

    const myQueriesResponse = await apiRequest.call(
      this,
      'GET',
      `/${project}/_apis/wit/queries/My Queries?$depth=2&api-version=7.1-preview.2`,
      {},
      {},
    );
    if (myQueriesResponse.children) {
      queries = queries.concat(flattenQueries(myQueriesResponse.children, 'My Queries'));
    }

    return queries.sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [{ name: 'No Queries Found', value: '' }];
  }
}

export const queryProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['query'],
      },
    },
    options: [
      {
        name: 'Execute',
        value: 'execute',
        action: 'Execute a query',
      },
      {
        name: 'Create',
        value: 'create',
        action: 'Create a new query',
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete a query',
      },
    ],
    default: 'execute',
  },
  {
    displayName: 'Query Name or ID',
    name: 'queryId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getQueries',
      loadOptionsDependsOn: ['project'],
    },
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['query'],
        operation: ['execute', 'delete'],
      },
    },
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },
  {
    displayName: 'Query Name',
    name: 'queryName',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['query'],
        operation: ['create'],
      },
    },
    description: 'The name for the new query',
  },
  {
    displayName: 'Parent Path',
    name: 'parentPath',
    type: 'string',
    default: 'My Queries',
    required: true,
    displayOptions: {
      show: {
        resource: ['query'],
        operation: ['create'],
      },
    },
    description: 'The path to the folder where the query will be saved (e.g., "My Queries" or "Shared Queries/Team Folder")',
  },
  {
    displayName: 'WIQL (Work Item Query Language)',
    name: 'wiql',
    type: 'string',
    typeOptions: {
      rows: 5,
    },
    default: "SELECT [System.Id], [System.Title], [System.State] FROM workitems WHERE [System.TeamProject] = @project AND [System.WorkItemType] = 'Bug' AND [System.State] <> 'Closed'",
    required: true,
    displayOptions: {
      show: {
        resource: ['query'],
        operation: ['create'],
      },
    },
    description: 'The WIQL query to execute',
  },
];
