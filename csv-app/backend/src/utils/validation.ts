import { ValidationError } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]+$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value: string): boolean => {
  return value !== undefined && value !== null && value.trim() !== '';
};

export const createValidationError = (
  row: number,
  field: string,
  value: string,
  message: string
): ValidationError => ({
  row,
  field,
  value,
  message
});