/**
 * Secure Free Image Hosting Utility for Public Credential Sharing.
 *
 * Rules:
 * 1. Uploaded photos remain local & private for editing, live preview, and 300 DPI badge downloads.
 * 2. Only when the user explicitly triggers "Share" is an optimized portrait published to free,
 *    safe public cloud storage (freeimage.host / iili.io CDN) so remote recipients can view the credential.
 */

const FREEIMAGE_API_KEY = '6d207e02198a847aa98d0a2a901485a5';

/**
 * Optimizes an image to a clean 400x400 JPEG before cloud hosting to ensure fast loading
 * and low bandwidth consumption for recipients.
 */
async function optimizeImageForCloud(source: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxDim = 400;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#14171d';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      } else {
        resolve(source);
      }
    };
    img.onerror = () => resolve(source);
    img.src = source;
  });
}

/**
 * Publishes an operative photograph to free, secure public hosting for link sharing.
 */
export async function hostImageForSharing(imageSource: string): Promise<string> {
  if (!imageSource) return '';

  // 1. If already a public HTTPS URL or default preset asset, reuse directly
  if (imageSource.startsWith('https://') || imageSource.startsWith('http://')) {
    return imageSource;
  }

  // 2. Default SVG presets are vector URIs that don't need cloud hosting
  if (imageSource.startsWith('data:image/svg+xml')) {
    return imageSource;
  }

  try {
    // 3. Optimize image for lightweight cloud storage
    const optimizedBase64 = await optimizeImageForCloud(imageSource);
    const pureBase64 = optimizedBase64.includes(',') ? optimizedBase64.split(',')[1] : optimizedBase64;

    const formData = new FormData();
    formData.append('key', FREEIMAGE_API_KEY);
    formData.append('action', 'upload');
    formData.append('source', pureBase64);
    formData.append('format', 'json');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const result = await response.json();
      if (result?.image?.url) {
        return result.image.url as string;
      }
    }
  } catch {
    // Offline or network error - fall back to compact local representation
  }

  // Fallback: return optimized data url if cloud host was unreachable
  try {
    return await optimizeImageForCloud(imageSource);
  } catch {
    return imageSource;
  }
}
