import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function getUser(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const userId = this.getNodeParameter('userId', index) as string;

  return {
    method: 'GET',
    endpoint: `/_apis/userentitlements/${userId}?api-version=7.1`,
    baseUrl: 'https://vsaex.dev.azure.com/{organization}',
  };
}
