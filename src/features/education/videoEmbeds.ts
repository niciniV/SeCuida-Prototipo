export type ResolvedVideoEmbed = { kind: 'youtube'; embedUrl: string } | { kind: 'link'; url: string };

export function resolveVideoEmbed(url: string): ResolvedVideoEmbed {
  const videoId = parseYouTubeVideoId(url);

  if (videoId) {
    return { kind: 'youtube', embedUrl: `https://www.youtube.com/embed/${videoId}` };
  }

  return { kind: 'link', url };
}

function parseYouTubeVideoId(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') return normalizeYouTubeId(url.searchParams.get('v'));
      if (url.pathname.startsWith('/embed/')) return normalizeYouTubeId(url.pathname.split('/')[2]);
    }

    if (host === 'youtu.be') {
      return normalizeYouTubeId(url.pathname.slice(1));
    }
  } catch {
    return null;
  }

  return null;
}

function normalizeYouTubeId(value: string | null | undefined) {
  if (!value) return null;
  const trimmed = value.trim();
  return /^[A-Za-z0-9_-]{6,}$/.test(trimmed) ? trimmed : null;
}
