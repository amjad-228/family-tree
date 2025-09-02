import ExcelJS from 'exceljs';
import { ProcessedUser } from '../types';

export class ExcelExporter {
  async generateExcel(users: ProcessedUser[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Processed Users');

    // Add headers
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Time Spent (minutes)', key: 'timeSpent', width: 20 },
      { header: 'Phone Number', key: 'phone', width: 15 }
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add data rows
    users.forEach(user => {
      worksheet.addRow({
        name: user.name,
        email: user.email,
        timeSpent: user.timeSpent,
        phone: user.phone
      });
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      if (column.key) {
        const maxLength = Math.max(
          column.header?.length || 0,
          ...users.map(user => (user[column.key as keyof ProcessedUser]?.toString().length || 0))
        );
        column.width = Math.min(Math.max(maxLength + 2, 10), 50);
      }
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}