import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { IRequestOptions } from '../../types';
import { createRelease } from './create';
import { listReleases } from './list';

export async function executeRelease(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const operation = this.getNodeParameter('operation', index) as string;

  switch (operation) {
    case 'create':
      return await createRelease.call(this, index);
    case 'list':
      return await listReleases.call(this, index);
    default:
      throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported for release resource.`, { itemIndex: index });
  }
}
