const multer = require('multer');
const fs = require('fs/promises');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

const isJpeg = (buffer) => buffer.length >= 3 && buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
const isPng = (buffer) => buffer.length >= 8 &&
  buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47 &&
  buffer[4] === 0x0D && buffer[5] === 0x0A && buffer[6] === 0x1A && buffer[7] === 0x0A;
const isGif = (buffer) => buffer.length >= 6 &&
  ((buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38 && buffer[4] === 0x37 && buffer[5] === 0x61) ||
    (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38 && buffer[4] === 0x39 && buffer[5] === 0x61));
const isWebp = (buffer) => buffer.length >= 12 &&
  buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
  buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;

const hasValidImageSignature = async (filePath) => {
  const handle = await fs.open(filePath, 'r');
  try {
    const buffer = Buffer.alloc(12);
    const { bytesRead } = await handle.read(buffer, 0, 12, 0);
    const header = buffer.subarray(0, bytesRead);
    return isJpeg(header) || isPng(header) || isGif(header) || isWebp(header);
  } finally {
    await handle.close();
  }
};

const validateUploadedImages = async (req, res, next) => {
  try {
    const files = [];
    if (req.file) files.push(req.file);
    if (Array.isArray(req.files)) files.push(...req.files);

    for (const file of files) {
      const isValid = await hasValidImageSignature(file.path);
      if (!isValid) {
        await fs.unlink(file.path).catch(() => { });
        return res.status(400).json({ message: 'Signature de fichier image invalide.' });
      }
    }

    return next();
  } catch (error) {
    return res.status(400).json({ message: 'Fichier image invalide.' });
  }
};

module.exports = { upload, validateUploadedImages };
