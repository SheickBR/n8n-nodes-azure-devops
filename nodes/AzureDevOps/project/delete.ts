import { apiClient } from '../shared/apiClient';

export async function deleteProject(projectIdOrName: string): Promise<void> {
  await apiClient.delete(`/_apis/projects/${projectIdOrName}?api-version=7.1-preview.4`);
}
