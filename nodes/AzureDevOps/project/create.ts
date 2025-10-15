import { apiClient } from '../shared/apiClient';

export interface CreateProjectPayload {
  name: string;
  description?: string;
  visibility?: 'private' | 'public';
  [key: string]: any;
}

export async function createProject(payload: CreateProjectPayload): Promise<any> {
  const response = await apiClient.post(
    `/_apis/projects?api-version=7.1-preview.4`,
    payload
  );
  return response.data;
}
