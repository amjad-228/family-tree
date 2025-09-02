export interface RawCSVRow {
  [key: string]: string;
}

export interface ProcessedUser {
  name: string;
  email: string;
  phone: string;
  timeSpent: number; // in minutes
}

export interface ValidationError {
  row: number;
  field: string;
  value: string;
  message: string;
}

export interface ProcessingResult {
  validUsers: ProcessedUser[];
  errors: ValidationError[];
  totalRows: number;
  validRows: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}