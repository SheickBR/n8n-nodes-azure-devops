import { IExecuteFunctions, IHttpRequestMethods, NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../transport';
import { IRequestOptions } from '../../types';

export async function executeQuery(this: IExecuteFunctions, i: number): Promise<IRequestOptions> {
  const operation = this.getNodeParameter('operation', i) as string;
  const project = this.getNodeParameter('project', i) as string;
  const apiVersion = 'api-version=7.1-preview.2';
  const apiVersionWorkItems = 'api-version=7.1-preview.3';

  let endpoint = '';
  let method: IHttpRequestMethods = 'GET';
  let body: any = {};
  let headers: Record<string, string> = {};

  switch (operation) {
    case 'execute': {
      const queryId = this.getNodeParameter('queryId', i) as string;
      const wiqlEndpoint = `/${project}/_apis/wit/wiql/${queryId}?${apiVersion}`;

      const queryResult = await apiRequest.call(this, 'GET', wiqlEndpoint, {}, {});

      if (!queryResult.workItems || queryResult.workItems.length === 0) {
        endpoint = `/_apis/wit/workitems?${apiVersionWorkItems}`;
        break;
      }

      const workItemIds = queryResult.workItems.map((item: any) => item.id).join(',');
      endpoint = `/_apis/wit/workitems?ids=${workItemIds}&${apiVersionWorkItems}`;
      break;
    }
    case 'create': {
      const queryName = this.getNodeParameter('queryName', i) as string;
      const parentPath = this.getNodeParameter('parentPath', i) as string;
      const wiql = this.getNodeParameter('wiql', i) as string;

      method = 'POST';
      endpoint = `/${project}/_apis/wit/queries/${parentPath}?${apiVersion}`;
      body = { name: queryName, wiql };
      break;
    }
    case 'delete': {
      const queryId = this.getNodeParameter('queryId', i) as string;
      method = 'DELETE';
      endpoint = `/${project}/_apis/wit/queries/${queryId}?${apiVersion}`;
      break;
    }
    default:
      throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported for Query.`, { itemIndex: i });
  }

  return { method, endpoint, body, headers };
}
