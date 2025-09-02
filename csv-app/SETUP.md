# Quick Setup Guide

## Option 1: Quick Start with Docker (Recommended)

1. **Start PostgreSQL with Docker:**
```bash
docker-compose up -d postgres
```

2. **Install all dependencies:**
```bash
npm run install:all
```

3. **Setup database:**
```bash
npm run db:setup
```

4. **Start development servers:**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Option 2: Manual PostgreSQL Setup

1. **Install PostgreSQL locally**
2. **Create database:**
```sql
CREATE DATABASE csv_processing_db;
```

3. **Update environment files:**
   - Copy `backend/.env.example` to `backend/.env`
   - Update `DATABASE_URL` with your PostgreSQL credentials

4. **Follow steps 2-4 from Option 1**

## Testing the Application

1. Use the provided `sample-data.csv` file to test the upload functionality
2. The sample contains both valid and invalid data to demonstrate validation
3. After processing, you can export the cleaned data as Excel

## Troubleshooting

- **Database connection issues**: Check PostgreSQL is running and credentials are correct
- **Port conflicts**: Update PORT in backend/.env if 3001 is in use
- **CORS issues**: Ensure FRONTEND_URL in backend/.env matches your frontend URL