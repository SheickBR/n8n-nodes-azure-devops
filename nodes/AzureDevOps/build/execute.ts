import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { IRequestOptions } from '../../types';
import { createBuild } from './create';
import { getBuild } from './get';
import { listBuilds } from './list';

export async function executeBuild(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const operation = this.getNodeParameter('operation', index) as string;

  switch (operation) {
    case 'create':
      return await createBuild.call(this, index);
    case 'get':
      return await getBuild.call(this, index);
    case 'list':
      return await listBuilds.call(this, index);
    default:
      throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported for build resource.`, { itemIndex: index });
  }
}
