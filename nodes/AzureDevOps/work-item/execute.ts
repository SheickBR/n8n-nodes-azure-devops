import { IExecuteFunctions, IHttpRequestMethods, NodeOperationError } from 'n8n-workflow';
import { IRequestOptions } from '../../types';
import { WorkItemUpdate } from '../shared/interfaces';
import { createWorkItem } from './create';
import { updateWorkItem } from './update';
import { getWorkItem } from './get';
import { listWorkItems } from './list';
import { deleteWorkItem } from './delete';
import { listWorkItemChildren } from './listChildren';

export async function executeWorkItem(this: IExecuteFunctions, i: number): Promise<IRequestOptions> {
  const operation = this.getNodeParameter('operation', i) as string;
  const project = this.getNodeParameter('project', i) as string;
  const apiVersion = 'api-version=7.1-preview.3';

  let method: IHttpRequestMethods = 'GET';
  let endpoint = '';
  let body: any = {};
  let headers: Record<string, string> = {};

  switch (operation) {
    case 'get': {
      const workItemId = this.getNodeParameter('workItemId', i) as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;

      const expand = Array.isArray(additionalOptions.expand) && additionalOptions.expand.length > 0
        ? additionalOptions.expand.join(',')
        : undefined;

      const fields = additionalOptions.fields || undefined;
      const asOf = additionalOptions.asOf || undefined;

      const req = getWorkItem(project, workItemId, expand, fields, asOf);
      method = req.method;
      endpoint = req.endpoint;
      body = req.body;
      headers = req.headers ?? {};
      break;
    }
    case 'list': {
      const workItemIds = this.getNodeParameter('workItemIds', i) as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;

      const expand = Array.isArray(additionalOptions.expand) && additionalOptions.expand.length > 0
        ? additionalOptions.expand.join(',')
        : undefined;

      const fields = additionalOptions.fields || undefined;
      const asOf = additionalOptions.asOf || undefined;

      const req = listWorkItems(workItemIds, expand, fields, asOf);
      method = req.method;
      endpoint = req.endpoint;
      body = req.body;
      headers = req.headers ?? {};
      break;
    }
    case 'listChildren': {
      const req = await listWorkItemChildren.call(this, i);
      method = req.method;
      endpoint = req.endpoint;
      body = req.body;
      headers = req.headers ?? {};
      break;
    }
    case 'delete': {
      const workItemId = this.getNodeParameter('workItemId', i) as string;
      const destroy = this.getNodeParameter('destroy', i, false) as boolean;

      const req = deleteWorkItem(project, workItemId, destroy);
      method = req.method;
      endpoint = req.endpoint;
      body = req.body;
      headers = req.headers ?? {};
      break;
    }
    case 'create':
    case 'update': {
      method = operation === 'create' ? 'POST' : 'PATCH';
      headers['Content-Type'] = 'application/json-patch+json';

      const fieldsInputMode = this.getNodeParameter('fieldsInputMode', i) as string;
      let patch: WorkItemUpdate[] = [];

      if (fieldsInputMode === 'json') {
        const fieldsJson = this.getNodeParameter('fieldsJson', i) as string;
        patch = JSON.parse(fieldsJson);
      } else {
        const fieldsUi = this.getNodeParameter('fieldsUi', i, {}) as any;
        patch = [];
        if (fieldsUi.fieldValues && fieldsUi.fieldValues.length > 0) {
          for (const field of fieldsUi.fieldValues) {
            if (field.value !== undefined && field.value !== null && field.value !== '') {
              patch.push({
                op: 'add',
                path: `/fields/${field.fieldName}`,
                value: field.value,
              });
            }
          }
        }
      }

      if (operation === 'create') {
        const workItemType = this.getNodeParameter('workItemType', i) as string;

        const hasTitle = patch.some(p => p.path === '/fields/System.Title');
        if (!hasTitle) {
          throw new NodeOperationError(
            this.getNode(),
            'The field "System.Title" is required to create a work item. Please add it to the fields list.',
            { itemIndex: i }
          );
        }

        const req = createWorkItem(project, workItemType, patch);
        method = req.method;
        endpoint = req.endpoint;
        body = req.body;
        headers = { ...headers, ...(req.headers ?? {}) };
      } else {
        const workItemId = this.getNodeParameter('workItemId', i) as string;
        const req = updateWorkItem(project, workItemId, patch);
        method = req.method;
        endpoint = req.endpoint;
        body = req.body;
        headers = { ...headers, ...(req.headers ?? {}) };
      }
      break;
    }
    default:
      throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported for Work Items.`, { itemIndex: i });
  }

  // Ensure api-version in endpoints that may have been built without it (safety)
  if (!endpoint.includes('api-version=')) {
    if (endpoint.includes('?')) endpoint += `&${apiVersion}`;
    else endpoint += `?${apiVersion}`;
  }

  return { method, endpoint, body, headers };
}
