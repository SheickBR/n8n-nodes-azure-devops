import axios, { AxiosError } from 'axios';

if (!process.env.AZURE_DEVOPS_ORG_URL || !process.env.AZURE_DEVOPS_TOKEN) {
  throw new Error('Missing required environment variables for Azure DevOps integration.');
}

export const apiClient = axios.create({
  baseURL: process.env.AZURE_DEVOPS_ORG_URL,
  headers: {
    Authorization: `Basic ${Buffer.from(':' + process.env.AZURE_DEVOPS_TOKEN).toString('base64')}`,
    'Content-Type': 'application/json-patch+json',
  },
});

apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const message = error.response?.data || error.message;
    throw new Error(`Azure DevOps API Error: ${message}`);
  }
);
