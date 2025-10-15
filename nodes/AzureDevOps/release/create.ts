import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function createRelease(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const project = this.getNodeParameter('project', index) as string;
  const definitionId = this.getNodeParameter('definitionId', index) as string;
  const description = this.getNodeParameter('description', index, '') as string;
  const artifacts = this.getNodeParameter('artifacts', index, '') as string;

  const body: any = {
    definitionId: parseInt(definitionId, 10),
  };

  if (description) {
    body.description = description;
  }

  if (artifacts) {
    try {
      body.artifacts = typeof artifacts === 'string' ? JSON.parse(artifacts) : artifacts;
    } catch (error) {
      throw new Error('Artifacts must be valid JSON');
    }
  }

  return {
    method: 'POST',
    endpoint: `/${project}/_apis/release/releases?api-version=7.1`,
    body,
  };
}
