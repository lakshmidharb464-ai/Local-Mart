import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env.js';

if (ENV.CLOUDINARY.CLOUD_NAME && ENV.CLOUDINARY.API_KEY) {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY.CLOUD_NAME,
    api_key: ENV.CLOUDINARY.API_KEY,
    api_secret: ENV.CLOUDINARY.API_SECRET,
    secure: true,
  });
}

/**
 * Upload a memory buffer stream to Cloudinary
 * @param {Buffer} fileBuffer
 * @param {string} folder - subfolder in localfarm/
 * @returns {Promise<{secure_url: string, public_id: string, format: string, width: number, height: number}>}
 */
export const uploadToCloudinary = (fileBuffer, folder = 'general') => {
  return new Promise((resolve, reject) => {
    // If cloudinary credentials are not configured, fallback gracefully to mock or placeholder
    if (!ENV.CLOUDINARY.CLOUD_NAME || ENV.CLOUDINARY.CLOUD_NAME === 'demo_cloud') {
      const simulatedUrl = `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80`;
      return resolve({
        secure_url: simulatedUrl,
        public_id: `localfarm_${folder}_${Date.now()}`,
        format: 'jpg',
        width: 800,
        height: 600,
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `localfarm/${folder}`,
        resource_type: 'auto',
        transformation: [
          { width: 1200, crop: 'limit' },
          { quality: 'auto:good', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
