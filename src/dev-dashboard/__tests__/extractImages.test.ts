import { describe, expect, it } from 'vitest';
import type { DashboardDraftContent } from '../export/exportBundle';
import { extractImagesFromDrafts } from '../export/extractImages';

const pngDataUrl = (value: string) => `data:image/png;base64,${btoa(value)}`;

describe('extractImagesFromDrafts', () => {
  it('extracts uploaded material images into ZIP image paths', () => {
    const drafts: DashboardDraftContent = {
      flows: [],
      educationGroups: [],
      educationMaterials: [
        {
          id: 'material-one',
          title: 'Material',
          source: 'Equipe SeCuida',
          description: 'Descrição.',
          imageUrl: pngDataUrl('thumb'),
          imageFileName: 'thumb upload.png',
          featuredImage: {
            kind: 'uploaded',
            dataUrl: pngDataUrl('featured'),
            fileName: 'featured upload.png',
            alt: 'Imagem principal',
          },
          body: [
            {
              id: 'body-image',
              kind: 'image',
              imageUrl: pngDataUrl('body'),
              imageFileName: 'body upload.png',
              alt: 'Imagem interna',
            },
          ],
          tags: ['teste'],
          audience: 'teachers',
          review: { status: 'pending_review', reviewedBy: null, reviewedAt: null, notes: '' },
        },
      ],
    };

    const result = extractImagesFromDrafts(drafts);
    const material = result.json.educationMaterials[0];

    expect(result.images.map((image) => image.name)).toEqual([
      'images/material-one-thumbnail-thumb_upload.png',
      'images/material-one-featured-featured_upload.png',
      'images/material-one-block-body-image-body_upload.png',
    ]);
    expect(material?.imageUrl).toBe('./images/material-one-thumbnail-thumb_upload.png');
    expect(material?.featuredImage).toEqual({
      kind: 'uploaded',
      dataUrl: './images/material-one-featured-featured_upload.png',
      fileName: 'featured upload.png',
      alt: 'Imagem principal',
    });
    expect(material?.body?.[0]?.imageUrl).toBe('./images/material-one-block-body-image-body_upload.png');
    expect(JSON.stringify(result.json)).not.toContain('data:image/');
  });
});
