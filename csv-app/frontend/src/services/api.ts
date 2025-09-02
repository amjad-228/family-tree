import axios from 'axios';
import { ApiResponse, ProcessingResult, ProcessedUser } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for file processing
});

export const csvApi = {
  uploadCSV: async (file: File): Promise<ApiResponse<ProcessingResult>> => {
    const formData = new FormData();
    formData.append('csvFile', file);
    
    const response = await api.post('/csv/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  getProcessedData: async (): Promise<ApiResponse<ProcessedUser[]>> => {
    const response = await api.get('/csv/data');
    return response.data;
  },

  exportExcel: async (): Promise<Blob> => {
    const response = await api.get('/csv/export', {
      responseType: 'blob',
    });
    
    return response.data;
  },

  healthCheck: async (): Promise<{ status: string; message: string }> => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;