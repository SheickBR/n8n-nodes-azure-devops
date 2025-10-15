import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function listReleases(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const project = this.getNodeParameter('project', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;

  const credentials = await this.getCredentials('azureDevOpsApi') as any;
  const organizationUrl = credentials.organizationUrl.replace(/\/+$/, '');
  const organization = organizationUrl.split('/').pop();

  let endpoint = `https://vsrm.dev.azure.com/${organization}/${project}/_apis/release/releases?api-version=7.1`;

  if (!returnAll) {
    endpoint += `&$top=${limit}`;
  }

  return {
    method: 'GET',
    endpoint,
  };
}
