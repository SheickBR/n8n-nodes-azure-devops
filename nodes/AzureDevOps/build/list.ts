import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function listBuilds(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const project = this.getNodeParameter('project', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;

  let endpoint = `/${project}/_apis/build/builds?api-version=7.1`;

  if (!returnAll) {
    endpoint += `&$top=${limit}`;
  }

  return {
    method: 'GET',
    endpoint,
  };
}
