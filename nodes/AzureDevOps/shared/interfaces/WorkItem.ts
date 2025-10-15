export interface WorkItem {
  fields: {
    'System.Title': string;
    'System.Description'?: string;
    'System.AssignedTo'?: string;
    [key: string]: any;
  };
}

export interface WorkItemUpdate {
  op: 'add' | 'replace' | 'remove';
  path: string;
  value?: any;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}
