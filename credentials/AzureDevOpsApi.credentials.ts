import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

// The class name MUST match the filename for n8n to load it correctly.
export class AzureDevOpsApi implements ICredentialType {
	name = 'azureDevOpsApi';
	displayName = 'Azure DevOps API';
	documentationUrl = 'https://learn.microsoft.com/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate';
	properties: INodeProperties[] = [
		{
			displayName: 'Organization URL',
			name: 'organizationUrl',
			type: 'string',
			default: 'https://dev.azure.com/{your-organization}',
			placeholder: 'https://dev.azure.com/my-company',
			description: 'The URL of your Azure DevOps organization (e.g., https://dev.azure.com/my-company)',
			required: true,
		},
		{
			displayName: 'Personal Access Token (PAT)',
			name: 'personalAccessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your Azure DevOps PAT with required scopes: "Project and Team (Read & write)", "Service Hooks (Read & manage)", "Work Items (Read & write)", and "User Entitlements (Read)" for User operations',
			required: true,
		},
	];
}
