export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

export function acceptImageTypes(): string {
  return 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif';
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export function parseImageDataUrl(value: string | undefined): { mimeType: string; data: Uint8Array } | null {
  if (!value) return null;

  const match = value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match) return null;

  const mimeType = match[1] ?? '';
  if (!acceptImageTypes().split(',').includes(mimeType)) return null;

  try {
    const base64 = match[2] ?? '';
    if (base64.length % 4 !== 0) return null;

    const binary = atob(base64);
    const data = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      data[i] = binary.charCodeAt(i);
    }
    return { mimeType, data };
  } catch {
    return null;
  }
}

export function isImageDataUrl(value: string | undefined): value is string {
  return parseImageDataUrl(value) !== null;
}
