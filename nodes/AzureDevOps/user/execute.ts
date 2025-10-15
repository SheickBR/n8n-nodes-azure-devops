import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { IRequestOptions } from '../../types';
import { createUser } from './create';
import { deleteUser } from './delete';
import { getUser } from './get';
import { listUsers } from './list';

export async function executeUser(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const operation = this.getNodeParameter('operation', index) as string;

  switch (operation) {
    case 'create':
      return await createUser.call(this, index);
    case 'delete':
      return await deleteUser.call(this, index);
    case 'get':
      return await getUser.call(this, index);
    case 'list':
      return await listUsers.call(this, index);
    default:
      throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported for user resource.`, { itemIndex: index });
  }
}
