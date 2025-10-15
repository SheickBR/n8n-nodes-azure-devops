import { apiClient } from '../shared/apiClient';

export async function listProjects(): Promise<any[]> {
  const response = await apiClient.get(`/_apis/projects?api-version=7.1-preview.4`);
  return response.data?.value ?? [];
}
