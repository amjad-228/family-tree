# CSV Data Processing and Storage System

A full-stack web application for uploading, processing, validating, and exporting CSV data with user session time calculations.

## Features

- 📁 **CSV File Upload**: Drag & drop or click to upload CSV files
- 🔍 **Data Processing**: Automatically calculates total session time from various time formats
- ✅ **Data Validation**: Validates email formats, phone numbers, and required fields
- 📊 **Data Preview**: Interactive table showing processed data and validation errors
- 📈 **Excel Export**: Download processed data as Excel (.xlsx) files
- 🗄️ **Database Storage**: Stores validated data in PostgreSQL database
- 🎨 **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Axios for API communication
- Responsive design

### Backend
- Node.js with Express and TypeScript
- Prisma ORM for database management
- PostgreSQL database
- Multer for file uploads
- CSV-Parser for CSV processing
- ExcelJS for Excel generation

## Project Structure

```
csv-app/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Server entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── uploads/             # Temporary file storage
│   └── package.json
└── frontend/                # React application
    ├── src/
    │   ├── components/      # React components
    │   ├── services/        # API service layer
    │   ├── types/           # TypeScript interfaces
    │   └── App.tsx          # Main application
    └── package.json
```

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd csv-app/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

1. Create a PostgreSQL database named `csv_processing_db`
2. Copy the environment file and update database credentials:

```bash
# In backend directory
cp .env.example .env
```

3. Update the `DATABASE_URL` in `.env`:
```
DATABASE_URL="postgresql://username:password@localhost:5432/csv_processing_db"
```

4. Generate Prisma client and push schema:
```bash
npm run db:generate
npm run db:push
```

### 3. Environment Configuration

**Backend (.env):**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/csv_processing_db"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Running the Application

### Development Mode

1. **Start the backend server:**
```bash
cd backend
npm run dev
```
Server will run on `http://localhost:3001`

2. **Start the frontend development server:**
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

### Production Build

1. **Build the backend:**
```bash
cd backend
npm run build
npm start
```

2. **Build the frontend:**
```bash
cd frontend
npm run build
```

## API Endpoints

- `POST /api/csv/upload` - Upload and process CSV file
- `GET /api/csv/export` - Export processed data as Excel
- `GET /api/csv/data` - Get all processed data
- `GET /api/health` - Health check endpoint

## CSV Format Requirements

Your CSV file should contain the following columns (case-insensitive):

### Required Columns:
- **Name**: User's full name
- **Email**: Valid email address (format: user@domain.com)
- **Phone/PhoneNumber**: Phone number (digits only)

### Session Time Columns (flexible):
The system can process session time data in various formats:
- Single column: `SessionTime`, `TimeSpent`, `Duration`, `Minutes`, `TotalTime`
- Multiple sessions: `Session1`, `Session2`, `Session3`, etc.
- Time formats supported:
  - Minutes as numbers: `45`, `120.5`
  - Hours:Minutes format: `1:30`, `2:45`

### Example CSV:
```csv
Name,Email,Phone,Session1,Session2,Session3
John Doe,john@example.com,1234567890,30,45,15
Jane Smith,jane@example.com,9876543210,1:20,0:45,2:10
```

## Data Processing Logic

1. **CSV Parsing**: Reads and parses uploaded CSV files
2. **Field Normalization**: Handles case-insensitive column names
3. **Time Calculation**: Sums all session time columns and converts to minutes
4. **Validation**: 
   - Email format validation
   - Phone number (digits only)
   - Required field checks
5. **Database Storage**: Saves valid records to PostgreSQL
6. **Error Reporting**: Provides detailed validation errors with row numbers

## Validation Rules

- **Email**: Must match pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Phone**: Must contain only digits `/^[0-9]+$/`
- **Name**: Required, cannot be empty
- **Time Data**: Must have valid session time information

## Error Handling

- File upload errors (invalid format, size limits)
- CSV parsing errors (malformed data)
- Validation errors (invalid emails, phone numbers)
- Database connection errors
- Excel generation errors

## Security Features

- File type validation (CSV only)
- File size limits (10MB)
- CORS configuration
- Input sanitization
- SQL injection protection via Prisma ORM

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details