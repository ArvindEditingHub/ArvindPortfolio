// Small helpers so both video sections can accept either a direct video
// file URL (mp4 etc.) OR a YouTube link, from the same `video:` field.

/**
 * Extracts the 11-character YouTube video ID from any common YouTube URL
 * shape: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID,
 * youtube.com/shorts/ID. Returns null if the URL isn't a YouTube link.
 */
export function getYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/** High-res thumbnail YouTube hosts for every video — no local image needed. */
export function getYouTubeThumbnail(id) {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

/** Embed URL with autoplay on, ready to drop into an <iframe>. */
export function getYouTubeEmbedUrl(id) {
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
}