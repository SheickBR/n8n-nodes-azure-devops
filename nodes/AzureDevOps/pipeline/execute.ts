import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { IRequestOptions } from '../../types';
import { runPipeline } from './run';
import { listPipelines } from './list';

export async function executePipeline(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const operation = this.getNodeParameter('operation', index) as string;

  switch (operation) {
    case 'run':
      return await runPipeline.call(this, index);
    case 'list':
      return await listPipelines.call(this, index);
    default:
      throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported for pipeline resource.`, { itemIndex: index });
  }
}
