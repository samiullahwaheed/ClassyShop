import cloudinary from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function streamUpload(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: `classyshop/${folder}` }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
}

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No image file provided');
  }
  const folder = req.query.folder || 'misc';
  const result = await streamUpload(req.file.buffer, folder);
  res.status(201).json({
    success: true,
    data: { url: result.secure_url, public_id: result.public_id },
  });
});

export const deleteImage = asyncHandler(async (req, res) => {
  await cloudinary.uploader.destroy(req.params.publicId);
  res.json({ success: true, data: null });
});
