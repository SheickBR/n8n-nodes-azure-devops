import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function listUsers(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;

  const queryParams: string[] = ['api-version=7.1'];

  if (additionalFields.filter) {
    queryParams.push(`$filter=${encodeURIComponent(additionalFields.filter)}`);
  }

  if (additionalFields.orderBy) {
    queryParams.push(`$orderBy=${encodeURIComponent(additionalFields.orderBy)}`);
  }

  if (additionalFields.select) {
    queryParams.push(`select=${encodeURIComponent(additionalFields.select)}`);
  }

  if (additionalFields.continuationToken) {
    queryParams.push(`continuationToken=${encodeURIComponent(additionalFields.continuationToken)}`);
  }

  return {
    method: 'GET',
    endpoint: `/_apis/userentitlements?${queryParams.join('&')}`,
    baseUrl: 'https://vsaex.dev.azure.com/{organization}',
  };
}
