// Dashboard frontend. Fetches real data from the round_007-audited
// /api/stories and /api/stories/:id endpoints — no hardcoded story data
// lives in this file. Routing is hash-based so the story detail view never
// needs a server-side route beyond the static files themselves.

import { firstSentences, topStories } from './logic.js';

const CATEGORIES = ['research', 'models', 'products', 'open-source', 'policy', 'funding', 'safety'];
const CATEGORY_LABELS = {
  research: 'Research',
  models: 'Models',
  products: 'Products',
  'open-source': 'Open Source',
  policy: 'Policy',
  funding: 'Funding',
  safety: 'Safety',
};
const PLATFORM_LABELS = { rss: 'RSS', hn: 'Hacker News', github: 'GitHub', fixture: 'Fixture' };
// Item 16 asks for today's top 5 as cards; those are always the first five
// here. The grid shows more below them so the ranking is inspectable at a
// glance rather than needing a sort/filter round-trip per story.
const TOP_N = 24;

const state = { sort: 'mustknow', category: '' };

const homeView = document.getElementById('home-view');
const detailView = document.getElementById('detail-view');
const cardGrid = document.getElementById('card-grid');
const homeStatus = document.getElementById('home-status');
const homeTitle = document.getElementById('home-title');
const sortSelect = document.getElementById('sort-select');
const chipsContainer = document.getElementById('category-chips');

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });
}

function badgeClass(status) {
  return `badge badge-${status}`;
}

function scoreRow(label, score, extraClass = '') {
  const rationale = score.rationale ? `<details class="rationale"><summary>왜 이 점수인가?</summary><p>${escapeHtml(score.rationale)}</p></details>` : '';
  return `
    <div class="score-row ${extraClass}">
      <span class="score-label">${label}</span>
      <span class="score-bar-track"><span class="score-bar-fill" style="width:${score.value}%"></span></span>
      <span class="score-value">${score.value}</span>
    </div>
    ${rationale}
  `;
}

function renderCard(view) {
  const s = view.scores;
  const platforms = view.platforms.map((p) => `<span class="platform-tag">${PLATFORM_LABELS[p] || p}</span>`).join('');
  const primary = view.sources[0];
  const evidenceLinks = view.sources
    .slice(0, 3)
    .map((src) => `<a href="${escapeHtml(src.url)}" target="_blank" rel="noopener">${escapeHtml(src.source)}</a>`)
    .join(' · ');

  return `
    <article class="card">
      <span class="${badgeClass(view.verification.status)}">${escapeHtml(view.verification.statusLabel)}</span>
      <h2 class="card-title"><a href="#/story/${encodeURIComponent(view.id)}">${escapeHtml(view.title)}</a></h2>
      <p class="card-summary">${escapeHtml(firstSentences(view.summary, 3))}</p>
      <p class="verification-reason">${escapeHtml(view.verification.reasoning)}</p>
      <div class="meta-row">${platforms} <span class="platform-tag">${escapeHtml(CATEGORY_LABELS[view.category] || view.category || 'uncategorized')}</span></div>
      <div class="score-list">
        ${scoreRow('Must Know', s.mustKnow, 'mustknow')}
        ${scoreRow('Viral', s.viral)}
        ${scoreRow('Influence', s.influence)}
        ${scoreRow('Credibility', s.credibility)}
        ${scoreRow('Impact', s.impact)}
      </div>
      <div class="card-links">
        <a href="${escapeHtml(primary.url)}" target="_blank" rel="noopener">원문</a>
        <span>근거: ${evidenceLinks}</span>
      </div>
    </article>
  `;
}

async function fetchStories() {
  const params = new URLSearchParams({ sort: state.sort });
  if (state.category) params.set('category', state.category);
  const res = await fetch(`/api/stories?${params}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const body = await res.json();
  return body.stories;
}

async function renderHome() {
  detailView.hidden = true;
  homeView.hidden = false;
  homeStatus.textContent = '불러오는 중...';
  cardGrid.innerHTML = '';

  try {
    const stories = await fetchStories();
    const top = topStories(stories, TOP_N);
    homeTitle.textContent = state.category ? `${CATEGORY_LABELS[state.category]} — Must Know` : '오늘의 Must Know';
    if (top.length === 0) {
      homeStatus.textContent = '';
      cardGrid.innerHTML = '<div class="empty-box">이 필터에 해당하는 스토리가 없습니다.</div>';
      return;
    }
    homeStatus.textContent = `${top.length}개 스토리 · 정렬: ${sortSelect.options[sortSelect.selectedIndex].text}`;
    cardGrid.innerHTML = top.map(renderCard).join('');
  } catch (err) {
    homeStatus.textContent = '';
    cardGrid.innerHTML = `<div class="error-box">데이터를 불러오지 못했습니다: ${escapeHtml(err.message)}</div>`;
  }
}

function renderTimeline(timeline) {
  return timeline
    .map(
      (t) => `<li><time>${formatDate(t.publishedAt)}</time><a href="${escapeHtml(t.url)}" target="_blank" rel="noopener">${escapeHtml(t.source)}</a> — ${escapeHtml(t.title)}</li>`,
    )
    .join('');
}

function renderReactionsByPlatform(map) {
  return Object.entries(map)
    .map(([platform, entries]) => {
      const rows = entries
        .map((e) => `<div class="reaction-item"><a href="${escapeHtml(e.url)}" target="_blank" rel="noopener">${escapeHtml(e.source)}</a>: ${Object.entries(e.reactions).map(([k, v]) => `${v} ${k}`).join(', ') || 'no reaction data'}</div>`)
        .join('');
      return `<div class="platform-block"><h3>${PLATFORM_LABELS[platform] || platform}</h3>${rows}</div>`;
    })
    .join('');
}

function renderSourceList(sources) {
  return sources
    .map(
      (s) => `<li><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.title)}</a><div class="source-meta">${escapeHtml(s.source)} · ${escapeHtml(s.publisherType)} · ${formatDate(s.publishedAt)}</div></li>`,
    )
    .join('');
}

function scoreCard(title, score) {
  return `
    <div class="score-card">
      <h3>${title}</h3>
      <div class="big-value">${score.value}</div>
      <p>${escapeHtml(score.rationale)}</p>
    </div>
  `;
}

async function renderDetail(id) {
  homeView.hidden = true;
  detailView.hidden = false;
  detailView.innerHTML = '<p class="status-line">불러오는 중...</p>';

  try {
    const res = await fetch(`/api/stories/${encodeURIComponent(id)}`);
    if (res.status === 404) {
      detailView.innerHTML = '<a class="back-link" href="#/">&larr; 홈으로</a><div class="error-box">해당 스토리를 찾을 수 없습니다.</div>';
      return;
    }
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const view = await res.json();
    const s = view.scores;

    detailView.innerHTML = `
      <a class="back-link" href="#/">&larr; 홈으로</a>
      <div class="detail-header">
        <span class="${badgeClass(view.verification.status)}">${escapeHtml(view.verification.statusLabel)}</span>
        <h1>${escapeHtml(view.title)}</h1>
        <p class="card-summary">${escapeHtml(view.summary)}</p>
        <p class="verification-reason">${escapeHtml(view.verification.reasoning)} (독립 출처 ${view.verification.independentSourceCount}개)</p>
        <div class="meta-row">
          ${view.platforms.map((p) => `<span class="platform-tag">${PLATFORM_LABELS[p] || p}</span>`).join('')}
          <span class="platform-tag">${escapeHtml(CATEGORY_LABELS[view.category] || view.category || 'uncategorized')}</span>
        </div>
      </div>

      <div class="detail-scores">
        ${scoreCard('Must Know', s.mustKnow)}
        ${scoreCard('Viral', s.viral)}
        ${scoreCard('Publisher Influence', s.influence)}
        ${scoreCard('Credibility', s.credibility)}
        ${scoreCard('Industry Impact', s.impact)}
      </div>

      <div class="panel">
        <h2>타임라인</h2>
        <ul class="timeline">${renderTimeline(view.timeline)}</ul>
      </div>

      <div class="panel">
        <h2>플랫폼별 반응</h2>
        ${renderReactionsByPlatform(view.reactionsByPlatform)}
      </div>

      <div class="panel">
        <h2>관련 출처 · 근거</h2>
        <ul class="source-list">${renderSourceList(view.sources)}</ul>
      </div>
    `;
  } catch (err) {
    detailView.innerHTML = `<a class="back-link" href="#/">&larr; 홈으로</a><div class="error-box">불러오지 못했습니다: ${escapeHtml(err.message)}</div>`;
  }
}

function route() {
  const hash = location.hash;
  const match = hash.match(/^#\/story\/(.+)$/);
  if (match) {
    renderDetail(decodeURIComponent(match[1]));
  } else {
    renderHome();
  }
}

function buildCategoryChips() {
  for (const cat of CATEGORIES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.dataset.category = cat;
    btn.textContent = CATEGORY_LABELS[cat];
    chipsContainer.appendChild(btn);
  }
}

function initControls() {
  buildCategoryChips();

  sortSelect.addEventListener('change', () => {
    state.sort = sortSelect.value;
    renderHome();
  });

  chipsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    state.category = btn.dataset.category;
    for (const chip of chipsContainer.querySelectorAll('.chip')) chip.classList.toggle('active', chip === btn);
    renderHome();
  });
}

function initTheme() {
  const stored = localStorage.getItem('theme');
  const preferred = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(preferred);

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.getElementById('theme-toggle').textContent = theme === 'dark' ? '☀️' : '🌙';
}

initTheme();
initControls();
window.addEventListener('hashchange', route);
route();
