import { Request, Response } from 'express';
import { CSVProcessor } from '../services/csvProcessor';
import { DatabaseService } from '../services/database';
import { ExcelExporter } from '../services/excelExporter';
import { ApiResponse, ProcessingResult, ProcessedUser } from '../types';
import fs from 'fs';
import path from 'path';

export class CSVController {
  private csvProcessor: CSVProcessor;
  private databaseService: DatabaseService;
  private excelExporter: ExcelExporter;

  constructor() {
    this.csvProcessor = new CSVProcessor();
    this.databaseService = new DatabaseService();
    this.excelExporter = new ExcelExporter();
  }

  async uploadAndProcess(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        } as ApiResponse<null>);
        return;
      }

      const filePath = req.file.path;
      
      // Process CSV
      const result: ProcessingResult = await this.csvProcessor.processCSV(filePath);
      
      // Save valid users to database
      if (result.validUsers.length > 0) {
        await this.databaseService.saveUsers(result.validUsers);
      }
      
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      
      res.json({
        success: true,
        data: result,
        message: `Processed ${result.validRows} out of ${result.totalRows} rows successfully`
      } as ApiResponse<ProcessingResult>);
      
    } catch (error) {
      console.error('Error processing CSV:', error);
      
      // Clean up file if it exists
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to process CSV file',
        errors: []
      } as ApiResponse<null>);
    }
  }

  async exportExcel(req: Request, res: Response): Promise<void> {
    try {
      // Get all users from database
      const users = await this.databaseService.getAllUsers();
      
      if (users.length === 0) {
        res.status(404).json({
          success: false,
          message: 'No data available to export'
        } as ApiResponse<null>);
        return;
      }
      
      // Generate Excel file
      const excelBuffer = await this.excelExporter.generateExcel(users);
      
      // Set response headers for file download
      const filename = `processed_users_${new Date().toISOString().split('T')[0]}.xlsx`;
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', excelBuffer.length);
      
      res.send(excelBuffer);
      
    } catch (error) {
      console.error('Error exporting Excel:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export Excel file'
      } as ApiResponse<null>);
    }
  }

  async getProcessedData(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.databaseService.getAllUsers();
      
      res.json({
        success: true,
        data: users,
        message: `Retrieved ${users.length} processed records`
      } as ApiResponse<ProcessedUser[]>);
      
    } catch (error) {
      console.error('Error fetching processed data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch processed data'
      } as ApiResponse<null>);
    }
  }
}