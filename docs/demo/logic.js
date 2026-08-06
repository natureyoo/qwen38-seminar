// Pure (DOM-free) dashboard logic, split out of app.js so it's importable
// from a Node test without needing a browser/document.

// Cards must show a summary of "3문장 이하" (item 17) — the API doesn't
// pre-truncate, so this trims to the first 3 sentences client-side. Decimal
// numbers/version strings ("GPT-5.2", "$1.2 billion") have a '.' that is not
// a sentence boundary, so those are masked before splitting and restored after.
export function firstSentences(text, n = 3) {
  const masked = text.replace(/(\d)\.(\d)/g, '$1{{DOT}}$2');
  const parts = masked.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [masked];
  return parts.slice(0, n).join(' ').replace(/\s+/g, ' ').trim().replace(/\{\{DOT\}\}/g, '.');
}

// Item 16: home screen shows today's top-N Must Know stories. Stories are
// assumed already sorted by the requested criterion (the API does the sort).
export function topStories(stories, n = 5) {
  return stories.slice(0, n);
}
