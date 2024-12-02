export * from './auth';

// Common types used across the application
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface TableColumn {
  id: string;
  label: string;
  accessor: string;
  sortable?: boolean;
  render?: (value: any) => React.ReactNode;
}
