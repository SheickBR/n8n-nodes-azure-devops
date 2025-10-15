import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function getBuild(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const project = this.getNodeParameter('project', index) as string;
  const buildId = this.getNodeParameter('buildId', index) as string;

  return {
    method: 'GET',
    endpoint: `/${project}/_apis/build/builds/${buildId}?api-version=7.1`,
  };
}
