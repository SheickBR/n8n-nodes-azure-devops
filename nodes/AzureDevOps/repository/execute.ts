import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { IRequestOptions } from '../../types';
import { createRepository } from './create';
import { deleteRepository } from './delete';
import { getRepository } from './get';
import { getCommits } from './getCommits';
import { listRepositories } from './list';

export async function executeRepository(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const operation = this.getNodeParameter('operation', index) as string;

  switch (operation) {
    case 'create':
      return await createRepository.call(this, index);
    case 'delete':
      return await deleteRepository.call(this, index);
    case 'get':
      return await getRepository.call(this, index);
    case 'get-commits':
      return await getCommits.call(this, index);
    case 'list':
      return await listRepositories.call(this, index);
    default:
      throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported for repository resource.`, { itemIndex: index });
  }
}
