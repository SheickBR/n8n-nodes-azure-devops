import { IExecuteFunctions, IHttpRequestMethods, NodeOperationError } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function executeProject(this: IExecuteFunctions, i: number): Promise<IRequestOptions> {
  const operation = this.getNodeParameter('operation', i) as string;

  const apiVersion = 'api-version=7.1-preview.4';

  let method: IHttpRequestMethods = 'GET';
  let endpoint = '';
  let body: any = {};
  let headers: Record<string, string> = {};

  switch (operation) {
    case 'list': {
      method = 'GET';
      endpoint = `/_apis/projects?${apiVersion}`;
      break;
    }
    case 'get': {
      const targetProjectId = this.getNodeParameter('targetProjectId', i) as string;
      method = 'GET';
      endpoint = `/_apis/projects/${encodeURIComponent(targetProjectId)}?${apiVersion}`;
      break;
    }
    case 'delete': {
      const targetProjectId = this.getNodeParameter('targetProjectId', i) as string;
      method = 'DELETE';
      endpoint = `/_apis/projects/${encodeURIComponent(targetProjectId)}?${apiVersion}`;
      break;
    }
    case 'create': {
      const name = this.getNodeParameter('name', i) as string;
      const description = this.getNodeParameter('description', i, '') as string;
      const visibility = this.getNodeParameter('visibility', i, 'private') as 'private' | 'public';
      const sourceControlType = this.getNodeParameter('sourceControlType', i, 'Git') as 'Git' | 'Tfvc';
      const processTemplateId = this.getNodeParameter('processTemplateId', i) as string;

      method = 'POST';
      endpoint = `/_apis/projects?${apiVersion}`;

      body = {
        name,
        description,
        visibility,
        capabilities: {
          versioncontrol: {
            sourceControlType,
          },
          processTemplate: {
            templateTypeId: processTemplateId,
          },
        },
      };
      break;
    }
    case 'update': {
      const targetProjectId = this.getNodeParameter('targetProjectId', i) as string;
      const updateName = this.getNodeParameter('updateName', i, '') as string;
      const updateDescription = this.getNodeParameter('updateDescription', i, '') as string;
      const updateVisibility = this.getNodeParameter('updateVisibility', i, 'private') as 'private' | 'public';
      const updateState = this.getNodeParameter('updateState', i, 'wellFormed') as
        | 'wellFormed'
        | 'createPending'
        | 'deleting'
        | 'new';

      method = 'PATCH';
      endpoint = `/_apis/projects/${encodeURIComponent(targetProjectId)}?${apiVersion}`;

      body = {};
      if (updateName) body.name = updateName;
      if (updateDescription) body.description = updateDescription;
      if (updateVisibility) body.visibility = updateVisibility;
      if (updateState) body.state = updateState;
      break;
    }
    default:
      throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported for Project.`, { itemIndex: i });
  }

  return { method, endpoint, body, headers };
}
