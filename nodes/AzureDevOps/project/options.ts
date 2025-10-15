import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { apiRequest } from '../../transport';

export async function getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  try {
    const response = await apiRequest.call(
      this,
      'GET',
      '/_apis/projects?api-version=7.1-preview.4',
      {},
      {},
    );

    if (response.value && Array.isArray(response.value)) {
      return response.value.map((project: any) => ({
        name: project.name,
        value: project.id,
      }));
    }
    return [];
  } catch {
    return [];
  }
}

export async function getProcesses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  try {
    const response = await apiRequest.call(
      this,
      'GET',
      '/_apis/work/processes?api-version=7.1',
      {},
      {},
    );

    if (response.value && Array.isArray(response.value)) {
      return response.value.map((process: any) => ({
        name: process.name,
        value: process.typeId,
      })).sort((a: any, b: any) => a.name.localeCompare(b.name));
    }

    return [
      { name: 'Agile', value: 'adcc42ab-9882-485e-a3ed-7678f01f66bc' },
      { name: 'Basic', value: 'b8a3a935-7e91-48b8-a94c-606d37c3e9f2' },
      { name: 'Scrum', value: '6b724908-ef14-45cf-84f8-768b5384da45' },
      { name: 'CMMI', value: '27450541-8e31-4150-9947-dc59f998fc01' },
    ];
  } catch (error) {
    console.error('Error loading process templates:', error);
    return [
      { name: 'Agile', value: 'adcc42ab-9882-485e-a3ed-7678f01f66bc' },
      { name: 'Basic', value: 'b8a3a935-7e91-48b8-a94c-606d37c3e9f2' },
      { name: 'Scrum', value: '6b724908-ef14-45cf-84f8-768b5384da45' },
      { name: 'CMMI', value: '27450541-8e31-4150-9947-dc59f998fc01' },
    ];
  }
}
