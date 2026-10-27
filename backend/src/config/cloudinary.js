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
export const uploadToCloudinary = (fileBuffer, folder = 'general', mimeType = 'image/jpeg') => {
  return new Promise((resolve, reject) => {
    // If Cloudinary credentials are fully configured in ENV, upload to Cloudinary
    if (ENV.CLOUDINARY.CLOUD_NAME && ENV.CLOUDINARY.API_KEY && ENV.CLOUDINARY.API_SECRET && ENV.CLOUDINARY.CLOUD_NAME !== 'demo_cloud') {
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
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
          });
        }
      );
      return uploadStream.end(fileBuffer);
    }

    // Direct buffer preservation (Data URI) so the user's authentic photo is stored without mock overrides
    const base64Data = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    return resolve({
      secure_url: base64Data,
      url: base64Data,
      public_id: `localfarm_${folder}_${Date.now()}`,
      format: 'auto',
      width: 800,
      height: 600,
    });
  });
};
/**
 * Generate an optimized Cloudinary delivery URL with dynamic dimensions and auto WebP/AVIF
 * @param {string} url - raw Cloudinary URL or fallback
 * @param {object} options - { width, height, crop, quality }
 * @returns {string} optimized URL
 */
export const getOptimizedImageUrl = (url, { width = 800, height = 600, crop = 'fill', quality = 'auto' } = {}) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;

  // Insert Cloudinary transformation parameters before /v[0-9]+/ or upload/
  const transform = `c_${crop},w_${width},h_${height},q_${quality},f_auto`;
  return url.replace('/upload/', `/upload/${transform}/`);
};

/**
 * Delete an asset from Cloudinary by public ID
 * @param {string} publicId
 * @returns {Promise<any>}
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId || publicId.startsWith('localfarm_')) return true;
  if (ENV.CLOUDINARY.CLOUD_NAME && ENV.CLOUDINARY.API_KEY && ENV.CLOUDINARY.API_SECRET) {
    try {
      return await cloudinary.uploader.destroy(publicId);
    } catch (e) {
      console.warn('Cloudinary delete error:', e.message);
      return null;
    }
  }
  return true;
};

export default cloudinary;
