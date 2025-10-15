import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function createRepository(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const project = this.getNodeParameter('project', index) as string;
  const name = this.getNodeParameter('name', index) as string;

  const body = {
    name,
    project: {
      id: project,
    },
  };

  return {
    method: 'POST',
    endpoint: `/${project}/_apis/git/repositories?api-version=7.1`,
    body,
  };
}
