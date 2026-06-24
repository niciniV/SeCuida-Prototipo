import type { DashboardDraftContent } from './exportBundle';
import type { EducationResource, EducationResourceBlock } from '../../domain/resources/types';

export interface ExtractedImage {
  name: string;
  data: Uint8Array;
  mimeType: string;
}

export interface ExtractImagesResult {
  json: DashboardDraftContent;
  images: ExtractedImage[];
}

const mimeToExt: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/bmp': 'bmp',
  'image/avif': 'avif',
};

function extFromMime(mime: string): string {
  return mimeToExt[mime] || 'bin';
}

function parseDataUrl(dataUrl: string): { mimeType: string; data: Uint8Array } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;

  const mimeType = match[1] ?? 'application/octet-stream';
  try {
    const base64 = match[2] ?? '';
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

function isDataUrl(value: string | undefined): value is string {
  return typeof value === 'string' && value.startsWith('data:');
}

function imageFileName(
  resourceId: string,
  purpose: string,
  blockId: string | null,
  fileName: string | undefined,
  mimeType: string,
): string {
  const ext = extFromMime(mimeType);
  const safeFileName = fileName ? fileName.replace(/[^a-zA-Z0-9._-]/g, '_') : '';
  const base = blockId
    ? `${resourceId}-block-${blockId}${safeFileName ? `-${safeFileName}` : ''}`
    : `${resourceId}-${purpose}${safeFileName ? `-${safeFileName}` : ''}`;
  return `images/${base}.${ext}`;
}

function replaceDataUrlInBlock(
  block: EducationResourceBlock,
  resourceId: string,
  images: ExtractedImage[],
): EducationResourceBlock {
  if (block.kind !== 'image' || !isDataUrl(block.imageUrl)) return block;

  const parsed = parseDataUrl(block.imageUrl);
  if (!parsed) return block;

  const name = imageFileName(resourceId, 'block', block.id, block.imageFileName, parsed.mimeType);
  images.push({ name, data: parsed.data, mimeType: parsed.mimeType });

  return {
    ...block,
    imageUrl: `./${name}`,
  };
}

function replaceDataUrlsInResource(resource: EducationResource, images: ExtractedImage[]): EducationResource {
  let next = resource;

  // Library thumbnail imageUrl
  if (isDataUrl(resource.imageUrl)) {
    const parsed = parseDataUrl(resource.imageUrl);
    if (parsed) {
      const name = imageFileName(resource.id, 'thumbnail', null, resource.imageFileName, parsed.mimeType);
      images.push({ name, data: parsed.data, mimeType: parsed.mimeType });
      next = { ...next, imageUrl: `./${name}` };
    }
  }

  // Featured image (uploaded kind)
  if (next.featuredImage?.kind === 'uploaded' && isDataUrl(next.featuredImage.dataUrl)) {
    const parsed = parseDataUrl(next.featuredImage.dataUrl);
    if (parsed) {
      const name = imageFileName(resource.id, 'featured', null, next.featuredImage.fileName, parsed.mimeType);
      images.push({ name, data: parsed.data, mimeType: parsed.mimeType });
      next = {
        ...next,
        featuredImage: { ...next.featuredImage, dataUrl: `./${name}` },
      };
    }
  }

  // Body blocks
  if (next.body) {
    const newBody = next.body.map((block) => replaceDataUrlInBlock(block, resource.id, images));
    if (newBody !== next.body) {
      next = { ...next, body: newBody };
    }
  }

  return next;
}

export function extractImagesFromDrafts(drafts: DashboardDraftContent): ExtractImagesResult {
  const images: ExtractedImage[] = [];

  const json: DashboardDraftContent = {
    ...drafts,
    educationMaterials: drafts.educationMaterials.map((resource) => replaceDataUrlsInResource(resource, images)),
  };

  return { json, images };
}
