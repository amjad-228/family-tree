import csv from 'csv-parser';
import fs from 'fs';
import { RawCSVRow, ProcessedUser, ValidationError, ProcessingResult } from '../types';
import { validateEmail, validatePhone, validateRequired, createValidationError } from '../utils/validation';

export class CSVProcessor {
  async processCSV(filePath: string): Promise<ProcessingResult> {
    const results: RawCSVRow[] = [];
    const validUsers: ProcessedUser[] = [];
    const errors: ValidationError[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          try {
            // Process each row
            results.forEach((row, index) => {
              const rowNumber = index + 2; // +2 because CSV starts at row 1 and we skip header
              const processedUser = this.processRow(row, rowNumber, errors);
              
              if (processedUser) {
                validUsers.push(processedUser);
              }
            });

            resolve({
              validUsers,
              errors,
              totalRows: results.length,
              validRows: validUsers.length
            });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  private processRow(row: RawCSVRow, rowNumber: number, errors: ValidationError[]): ProcessedUser | null {
    // Extract and normalize field names (case-insensitive)
    const fields = this.normalizeFields(row);
    
    // Extract required fields
    const name = fields.name || '';
    const email = fields.email || '';
    const phone = fields.phone || fields.phonenumber || '';
    
    // Calculate total session time
    const timeSpent = this.calculateTotalSessionTime(fields);
    
    // Validate fields
    let isValid = true;
    
    if (!validateRequired(name)) {
      errors.push(createValidationError(rowNumber, 'name', name, 'Name is required'));
      isValid = false;
    }
    
    if (!validateRequired(email)) {
      errors.push(createValidationError(rowNumber, 'email', email, 'Email is required'));
      isValid = false;
    } else if (!validateEmail(email)) {
      errors.push(createValidationError(rowNumber, 'email', email, 'Invalid email format'));
      isValid = false;
    }
    
    if (!validateRequired(phone)) {
      errors.push(createValidationError(rowNumber, 'phone', phone, 'Phone number is required'));
      isValid = false;
    } else if (!validatePhone(phone)) {
      errors.push(createValidationError(rowNumber, 'phone', phone, 'Phone number must contain only digits'));
      isValid = false;
    }
    
    if (timeSpent <= 0) {
      errors.push(createValidationError(rowNumber, 'timeSpent', timeSpent.toString(), 'Invalid session time data'));
      isValid = false;
    }
    
    return isValid ? { name, email, phone, timeSpent } : null;
  }

  private normalizeFields(row: RawCSVRow): { [key: string]: string } {
    const normalized: { [key: string]: string } = {};
    
    Object.keys(row).forEach(key => {
      const normalizedKey = key.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      normalized[normalizedKey] = row[key]?.toString().trim() || '';
    });
    
    return normalized;
  }

  private calculateTotalSessionTime(fields: { [key: string]: string }): number {
    // Look for session time fields (various possible names)
    const timeFields = [
      'sessiontime', 'timespent', 'duration', 'minutes', 'totaltime',
      'session1', 'session2', 'session3', 'session4', 'session5'
    ];
    
    let totalMinutes = 0;
    
    timeFields.forEach(field => {
      const value = fields[field];
      if (value) {
        const numericValue = this.parseTimeToMinutes(value);
        if (numericValue > 0) {
          totalMinutes += numericValue;
        }
      }
    });
    
    // If no specific time fields found, look for any numeric fields that might represent time
    if (totalMinutes === 0) {
      Object.keys(fields).forEach(key => {
        if (key.includes('time') || key.includes('duration') || key.includes('session')) {
          const numericValue = this.parseTimeToMinutes(fields[key]);
          if (numericValue > 0) {
            totalMinutes += numericValue;
          }
        }
      });
    }
    
    return totalMinutes;
  }

  private parseTimeToMinutes(timeValue: string): number {
    if (!timeValue) return 0;
    
    // Remove any non-numeric characters except decimal points and colons
    const cleanValue = timeValue.toString().trim();
    
    // Check if it's in HH:MM format
    if (cleanValue.includes(':')) {
      const parts = cleanValue.split(':');
      if (parts.length === 2) {
        const hours = parseFloat(parts[0]) || 0;
        const minutes = parseFloat(parts[1]) || 0;
        return hours * 60 + minutes;
      }
    }
    
    // Check if it's already in minutes (just a number)
    const numericValue = parseFloat(cleanValue);
    return isNaN(numericValue) ? 0 : numericValue;
  }
}