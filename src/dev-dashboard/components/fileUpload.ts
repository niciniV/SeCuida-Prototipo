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
