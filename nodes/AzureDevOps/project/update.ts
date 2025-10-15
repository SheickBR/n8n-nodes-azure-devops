import { apiClient } from '../shared/apiClient';

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  visibility?: 'private' | 'public';
  state?: 'wellFormed' | 'createPending' | 'deleting' | 'new';
  [key: string]: any;
}

export async function updateProject(projectIdOrName: string, payload: UpdateProjectPayload): Promise<any> {
  const response = await apiClient.patch(
    `/_apis/projects/${projectIdOrName}?api-version=7.1-preview.4`,
    payload
  );
  return response.data;
}
