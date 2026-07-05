export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function renderSourceLinks(sourceLinks = []) {
  return sourceLinks
    .map((source) => `<a href="${source.url}" target="_blank" rel="noopener">${escapeHtml(source.label)}</a>`)
    .join('');
}

export function setStatus(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.style.color = isError ? '#c92a2a' : '#087f5b';
}
