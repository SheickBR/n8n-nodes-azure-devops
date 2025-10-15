import {
	IExecuteFunctions,
	IHttpRequestOptions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	NodeApiError,
	IHookFunctions,
	IWebhookFunctions,
} from 'n8n-workflow';

export interface IAzureDevOpsCredentials {
	organizationUrl: string;
	personalAccessToken: string;
}

export async function apiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: object = {},
	headers: Record<string, string> = {},
	baseUrl?: string,
): Promise<any> {
	const credentials = await this.getCredentials('azureDevOpsApi') as IAzureDevOpsCredentials;

	const organizationUrl = credentials.organizationUrl.replace(/\/+$/, '');

	const organizationName = organizationUrl.includes('dev.azure.com')
		? organizationUrl.split('/').pop() || ''
		: organizationUrl.split('//')[1]?.split('.')[0] || '';

	const finalBaseUrl = baseUrl
		? baseUrl.replace('{organization}', organizationName)
		: organizationUrl;

	const auth = Buffer.from(`:${credentials.personalAccessToken}`).toString('base64');

	const options: IHttpRequestOptions = {
		baseURL: finalBaseUrl,
		url: endpoint,
		method,
		headers: {
			'Authorization': `Basic ${auth}`,
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			...headers,
		},
		json: true,
		returnFullResponse: false,
	};

	if (method !== 'GET' && Object.keys(body).length > 0) {
		options.body = body;
	}

	try {
		return await this.helpers.httpRequest(options);
	} catch (error: any) {
		let errorMessage = 'Azure DevOps API request failed';
		let statusCode = error.statusCode || 500;
		let description = '';

		if (error.response?.body) {
			const responseBody = error.response.body;

			if (typeof responseBody === 'string') {
				try {
					const parsed = JSON.parse(responseBody);
					errorMessage = parsed.message || parsed.error || errorMessage;
				} catch {
					errorMessage = responseBody;
				}
			} else if (responseBody.message) {
				errorMessage = responseBody.message;
				if (responseBody.typeKey) {
					description = `Error type: ${responseBody.typeKey}`;
				}
			}
		} else if (error.message) {
			errorMessage = error.message;
		}

		throw new NodeApiError(this.getNode(), {
			message: errorMessage,
			description: description || error.description,
			httpCode: statusCode.toString(),
		});
	}
}
