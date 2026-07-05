import { escapeHtml, renderSourceLinks } from './dom.js';

export function renderIssues(issueGrid, issues) {
  if (!issueGrid) return;

  if (!issues.length) {
    issueGrid.innerHTML = '<p class="empty-state">No matching health issue found. Try fever, cough, stress, allergy, or stomach pain.</p>';
    return;
  }

  issueGrid.innerHTML = issues
    .map(
      (issue) => `
      <article class="issue-card" data-issue="${escapeHtml(issue.name)}">
        <div class="icon">${escapeHtml(issue.icon)}</div>
        <h3>${escapeHtml(issue.name)}</h3>
        <p>${escapeHtml(issue.desc)}</p>
        <div class="card-tags">
          ${issue.symptoms.slice(0, 3).map((symptom) => `<span>${escapeHtml(symptom)}</span>`).join('')}
        </div>
        <button type="button">View Recommendation</button>
      </article>
    `
    )
    .join('');
}

export function recommendationHtml(issue, safetyNotes, sourceLinks) {
  return `
    <div class="rec-head">
      <div class="rec-icon">${escapeHtml(issue.icon)}</div>
      <div>
        <p class="badge">${escapeHtml(issue.name)}</p>
        <h1>${escapeHtml(issue.name)} recommendation</h1>
        <p>${escapeHtml(issue.desc)}</p>
      </div>
    </div>
    <div class="tip-grid">
      <div class="tip"><b>First-care steps</b><p>${escapeHtml(issue.solution)}</p></div>
      <div class="tip"><b>Diet suggestion</b><p>${escapeHtml(issue.diet)}</p></div>
      <div class="tip warn"><b>Warning signs</b><p>${escapeHtml(issue.warning)}</p></div>
      <div class="tip"><b>Prevention</b><p>${escapeHtml(issue.prevention)}</p></div>
    </div>
    <div class="medical-note">
      <b>Safety note</b>
      <p>${escapeHtml(safetyNotes.disclaimer)} ${escapeHtml(safetyNotes.emergency)}</p>
      <div class="source-links">${renderSourceLinks(sourceLinks)}</div>
    </div>
  `;
}
