import { apiClient } from '../shared/apiClient';

export async function getProject(projectIdOrName: string): Promise<any> {
  const response = await apiClient.get(`/_apis/projects/${projectIdOrName}?api-version=7.1-preview.4`);
  return response.data;
}
