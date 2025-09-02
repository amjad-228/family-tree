import express from 'express';
import multer from 'multer';
import path from 'path';
import { CSVController } from '../controllers/csvController';

const router = express.Router();
const csvController = new CSVController();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || path.extname(file.originalname).toLowerCase() === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Routes
router.post('/upload', upload.single('csvFile'), csvController.uploadAndProcess.bind(csvController));
router.get('/export', csvController.exportExcel.bind(csvController));
router.get('/data', csvController.getProcessedData.bind(csvController));

export default router;