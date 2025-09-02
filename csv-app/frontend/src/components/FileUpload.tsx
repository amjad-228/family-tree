import React, { useState, useRef } from 'react';
import { csvApi } from '../services/api';
import { ProcessingResult } from '../types';

interface FileUploadProps {
  onUploadSuccess: (result: ProcessingResult) => void;
  onUploadError: (error: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, onUploadError }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      onUploadError('Please select a valid CSV file');
      return;
    }

    setIsUploading(true);
    
    try {
      const response = await csvApi.uploadCSV(file);
      
      if (response.success && response.data) {
        onUploadSuccess(response.data);
      } else {
        onUploadError(response.message || 'Failed to process CSV file');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      onUploadError(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          {isUploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-lg font-medium text-gray-600">Processing CSV file...</p>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-600">
                {dragActive ? 'Drop your CSV file here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-gray-500">
                CSV files only (max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium mb-2">Expected CSV format:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Name, Email, Phone Number columns are required</li>
          <li>Session time data (can be in various formats: minutes, HH:MM, multiple session columns)</li>
          <li>Email must be in valid format (example@domain.com)</li>
          <li>Phone numbers must contain only digits</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;