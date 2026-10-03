import multer from 'multer';
import { uploadToCloudinary } from '../config/cloudinary.js';

// Multer memory storage configuration (Max 5MB per file)
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF documents are allowed!'), false);
    }
  },
});

/**
 * Handle Single or Multiple File Uploads to Cloudinary
 * POST /api/media/upload
 */
export async function uploadMedia(req, res, next) {
  try {
    const folder = req.query.folder || req.body.folder || 'general';
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No file(s) provided in upload request.',
      });
    }

    const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer, folder));
    const results = await Promise.all(uploadPromises);

    if (files.length === 1) {
      return res.json({
        success: true,
        message: 'File uploaded successfully.',
        url: results[0].secure_url,
        secure_url: results[0].secure_url,
        public_id: results[0].public_id,
        media: results[0],
      });
    }

    res.json({
      success: true,
      message: `${results.length} files uploaded successfully.`,
      urls: results.map((r) => r.secure_url),
      media: results,
    });
  } catch (error) {
    next(error);
  }
}
