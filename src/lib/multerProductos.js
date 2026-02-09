import multer from 'multer';

// Usar memoria para que el controlador pueda enviar el buffer al servicio Blob
const storage = multer.memoryStorage();

export const uploadProductos = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB por archivo (ajustable)
});