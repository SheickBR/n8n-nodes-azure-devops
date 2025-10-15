import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from '../../types';

export async function createUser(this: IExecuteFunctions, index: number): Promise<IRequestOptions> {
  const principalName = this.getNodeParameter('principalName', index) as string;
  const accessLevel = this.getNodeParameter('accessLevel', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;

  const body: any = {
    accessLevel: {
      accountLicenseType: accessLevel,
    },
    user: {
      principalName,
      subjectKind: 'user',
    },
  };

  if (additionalFields.projectEntitlements) {
    body.projectEntitlements = additionalFields.projectEntitlements;
  }

  if (additionalFields.groupAssignments) {
    body.groupAssignments = additionalFields.groupAssignments;
  }

  return {
    method: 'POST',
    endpoint: '/_apis/userentitlements?api-version=7.1',
    body,
    baseUrl: 'https://vsaex.dev.azure.com/{organization}',
  };
}
