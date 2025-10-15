import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function runPipeline(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const project = this.getNodeParameter('project', index) as string;
  const pipelineId = this.getNodeParameter('pipelineId', index) as string;
  const branch = this.getNodeParameter('branch', index, '') as string;
  const variables = this.getNodeParameter('variables', index, '') as string;

  const body: any = {};

  if (branch) {
    body.resources = {
      repositories: {
        self: {
          refName: branch,
        },
      },
    };
  }

  if (variables) {
    try {
      const parsedVariables = typeof variables === 'string' ? JSON.parse(variables) : variables;
      body.variables = parsedVariables;
    } catch (error) {
      throw new Error('Variables must be valid JSON');
    }
  }

  return {
    method: 'POST',
    endpoint: `/${project}/_apis/pipelines/${pipelineId}/runs?api-version=7.1`,
    body,
  };
}
