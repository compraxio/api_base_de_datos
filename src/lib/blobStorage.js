import fs from 'node:fs';

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!TOKEN) {
  // No lanzar aquí para no romper en todos los entornos; los métodos comprobarán.
}

/**
 * uploadBuffer
 * Subir un buffer a un servicio Blob (por defecto usa la API de Vercel Blob).
 * Devuelve una URL pública o la respuesta del servicio.
 *
 * Nota: la URL/endpoint puede necesitar ajustes según tu proveedor. Si la API cambia,
 * actualiza `uploadBuffer` con el endpoint correcto.
 */
export async function uploadBuffer(buffer, filename, contentType = 'application/octet-stream') {
  if (!TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN no está definido en el entorno');

  // Endpoint tentativa para Vercel Blob; ajusta si tu proveedor tiene otro.
    const endpoint = `https://api.vercel.com/v1/blob/${encodeURIComponent(filename)}`;
    console.log(endpoint)

  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': contentType,
    },
    body: buffer,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Error subiendo a Blob: ${res.status} ${res.statusText} ${text}`);
  }

  // Intentar parsear JSON devuelto por el servicio
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // Si no devolvió JSON, devolver al menos la URL construida (puede no estar pública)
  }

  // Si el servicio devuelve una URL, usarla. Ajusta según la respuesta real.
  if (data && (data.url || data.publicUrl || data.key)) {
    return data.url ?? data.publicUrl ?? data.key;
  }

  // Si no hay URL en la respuesta, construir una ruta pública tentativa.
  // Cambia esto según tu dominio/servicio.
  return `https://vercel-storage.example/${encodeURIComponent(filename)}`;
}

export async function uploadFilePath(filePath, filename, contentType) {
  const buffer = fs.readFileSync(filePath);
  return uploadBuffer(buffer, filename, contentType);
}

/**
 * deleteBlob
 * Elimina un archivo del servicio Blob usando su URL o filename
 * Funciona específicamente con URLs de Vercel Blob Storage
 */
export async function deleteBlob(urlOrFilename) {
  if (!TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN no está definido en el entorno');
  
  if (!urlOrFilename) {
    console.warn('deleteBlob: urlOrFilename está vacío');
    return;
  }

  try {
    // Extraer el filename de la URL de Vercel Blob o de una ruta local
    let filename = urlOrFilename;
    if (urlOrFilename.startsWith('http')) {
      // Para URLs de Vercel Blob: https://*.public.blob.vercel-storage.com/ob/filename
      const urlParts = urlOrFilename.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      
      // Remover parámetros de query si existen
      filename = lastPart.split('?')[0];
      
      console.log(`Extraído filename: ${filename} de URL: ${urlOrFilename}`);
    } else if (urlOrFilename.includes('/')) {
      // Para rutas locales: /tmp/uploads/grupo/filename.png
      const pathParts = urlOrFilename.split('/');
      filename = pathParts[pathParts.length - 1];
      
      console.log(`Extraído filename: ${filename} de ruta local: ${urlOrFilename}`);
    }

    // Endpoint para eliminar en Vercel Blob
    const endpoint = `https://api.vercel.com/v1/blob/${encodeURIComponent(filename)}`;

    const res = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`Error eliminando Blob: ${res.status} ${res.statusText} ${text}`);
      throw new Error(`Error eliminando de Blob: ${res.status} ${res.statusText}`);
    }

    console.log(`Archivo ${filename} eliminado correctamente de Blob`);
  } catch (error) {
    console.error('Error en deleteBlob:', error);
    throw error;
  }
}
