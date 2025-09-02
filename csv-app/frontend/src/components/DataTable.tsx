import React from 'react';
import { ProcessedUser, ValidationError } from '../types';

interface DataTableProps {
  users: ProcessedUser[];
  errors: ValidationError[];
  onExportExcel: () => void;
  isExporting: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ users, errors, onExportExcel, isExporting }) => {
  const hasData = users.length > 0;
  const hasErrors = errors.length > 0;

  return (
    <div className="w-full space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Processing Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{users.length}</div>
            <div className="text-sm text-green-700">Valid Records</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">{errors.length}</div>
            <div className="text-sm text-red-700">Errors Found</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {users.reduce((sum, user) => sum + user.timeSpent, 0).toFixed(1)}
            </div>
            <div className="text-sm text-blue-700">Total Minutes</div>
          </div>
        </div>
      </div>

      {/* Export Button */}
      {hasData && (
        <div className="flex justify-end">
          <button
            onClick={onExportExcel}
            disabled={isExporting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export to Excel</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Errors Table */}
      {hasErrors && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-50 border-b border-red-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-red-800">Validation Errors</h3>
            <p className="text-sm text-red-600">The following rows contain invalid data and were not processed:</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Row</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {errors.map((error, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{error.row}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{error.field}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{error.value || '(empty)'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{error.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Valid Data Table */}
      {hasData && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-50 border-b border-green-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-green-800">Processed Data</h3>
            <p className="text-sm text-green-600">Successfully processed and validated records:</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent (min)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.timeSpent.toFixed(1)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {!hasData && !hasErrors && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">No data to display. Upload a CSV file to get started.</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;