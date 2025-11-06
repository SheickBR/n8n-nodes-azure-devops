import { IHttpRequestMethods } from 'n8n-workflow';

export interface IRequestOptions {
	method: IHttpRequestMethods;
	endpoint: string;
	body?: object;
	headers?: Record<string, string>;
	baseUrl?: string;
	qs?: Record<string, string | boolean | number | string[]>;
}
