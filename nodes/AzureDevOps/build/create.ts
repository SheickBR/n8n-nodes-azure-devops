import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function createBuild(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const project = this.getNodeParameter('project', index) as string;
  const definitionId = this.getNodeParameter('definitionId', index) as string;
  const sourceBranch = this.getNodeParameter('sourceBranch', index, '') as string;
  const sourceVersion = this.getNodeParameter('sourceVersion', index, '') as string;
  const parameters = this.getNodeParameter('parameters', index, '') as string;

  const body: any = {
    definition: {
      id: definitionId,
    },
  };

  if (sourceBranch) {
    body.sourceBranch = sourceBranch;
  }

  if (sourceVersion) {
    body.sourceVersion = sourceVersion;
  }

  if (parameters) {
    try {
      body.parameters = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
    } catch (error) {
      throw new Error('Parameters must be valid JSON');
    }
  }

  return {
    method: 'POST',
    endpoint: `/${project}/_apis/build/builds?api-version=7.1`,
    body,
  };
}
