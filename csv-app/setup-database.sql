-- Create database for CSV processing application
-- Run this script as a PostgreSQL superuser

CREATE DATABASE csv_processing_db;

-- Create a user for the application (optional)
-- CREATE USER csv_app_user WITH PASSWORD 'your_password_here';
-- GRANT ALL PRIVILEGES ON DATABASE csv_processing_db TO csv_app_user;

-- Connect to the database
\c csv_processing_db;

-- The Prisma schema will handle table creation
-- This script is just for initial database setup