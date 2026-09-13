'use strict';

(() => {
  const PAGE_SIZE = 24;
  const BPM_TOLERANCE = 4;
  const COLLAPSIBLE_PROMPT_LENGTH = 260;

  const normalize = value => String(value ?? '')
    .normalize('NFKC')
    .toLocaleLowerCase('ja')
    .replace(/\s+/g, ' ')
    .trim();

  const status = document.getElementById('copy-status');
  let statusTimer;

  function announce(message) {
    if (!status) return;
    window.clearTimeout(statusTimer);
    status.textContent = message;
    statusTimer = window.setTimeout(() => { status.textContent = ''; }, 5500);
  }

  function selectAndCopy(element) {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    if (!selection) return false;
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      return document.execCommand('copy');
    } catch {
      return false;
    }
  }

  document.querySelectorAll('[data-copy-target]').forEach(button => {
    button.hidden = false;
    let buttonTimer;

    button.addEventListener('click', async () => {
      const target = document.getElementById(button.dataset.copyTarget);
      if (!target) {
        announce('コピー対象が見つかりませんでした。');
        return;
      }

      const promptText = target.textContent.trim();
      let copied = false;

      if (window.isSecureContext && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(promptText);
          copied = true;
        } catch {
          // ブラウザ互換の選択コピーへ進みます。
        }
      }

      if (!copied) copied = selectAndCopy(target);

      if (!copied) {
        announce('自動コピーできませんでした。選択された英文を手動でコピーしてください。');
        return;
      }

      window.clearTimeout(buttonTimer);
      button.dataset.copied = 'true';
      button.textContent = 'コピーしました';
      announce('プロンプトをコピーしました。SunoのStyle／Styles欄に貼り付けてください。');
      buttonTimer = window.setTimeout(() => {
        delete button.dataset.copied;
        button.textContent = 'プロンプトをコピー';
      }, 2500);
    });
  });

  // 長いプロンプト本文は折りたたみ、ボタンで全文を表示します。
  document.querySelectorAll('[data-expand-target]').forEach(button => {
    const target = document.getElementById(button.dataset.expandTarget);
    const card = button.closest('[data-prompt-card]');
    if (!target || !card) return;
    if (target.textContent.trim().length <= COLLAPSIBLE_PROMPT_LENGTH) return;

    card.dataset.collapsible = 'true';
    button.hidden = false;
    button.addEventListener('click', () => {
      const expanded = card.dataset.expanded === 'true';
      card.dataset.expanded = String(!expanded);
      button.setAttribute('aria-expanded', String(!expanded));
      button.textContent = expanded ? '全文を表示' : '折りたたむ';
      if (expanded) card.scrollIntoView({ block: 'nearest' });
    });
  });

  const catalog = document.querySelector('[data-catalog]');
  if (!catalog) return;

  function parseBpm(value) {
    const match = String(value ?? '').match(/^(\d+)(?:-(\d+))?$/);
    if (!match) return null;
    const minimum = Number(match[1]);
    const maximum = match[2] ? Number(match[2]) : minimum;
    return [minimum, maximum];
  }

  function loadSynonyms() {
    const map = new Map();
    const source = document.getElementById('search-synonyms');
    if (!source) return map;

    let groups = [];
    try {
      groups = JSON.parse(source.textContent);
    } catch {
      return map;
    }
    if (!Array.isArray(groups)) return map;

    groups.forEach(group => {
      const terms = [...new Set((group?.terms ?? []).map(normalize).filter(Boolean))];
      terms.forEach(term => {
        const bucket = map.get(term) ?? new Set();
        terms.forEach(other => bucket.add(other));
        map.set(term, bucket);
      });
    });
    return map;
  }

  const synonyms = loadSynonyms();

  const cards = [...document.querySelectorAll('[data-prompt-card]')].map(element => ({
    element,
    tags: new Set(element.dataset.tags.split(/\s+/).filter(Boolean)),
    bpm: parseBpm(element.dataset.bpm),
    searchText: normalize(element.dataset.search)
  }));
  const filterButtons = [...catalog.querySelectorAll('[data-tag]')];
  const filterGroups = [...catalog.querySelectorAll('[data-filter-group]')];
  const cardTagLinks = [...document.querySelectorAll('[data-card-tag]')];
  const clearButtons = [...document.querySelectorAll('[data-clear-filter]')];
  const searchInput = document.getElementById('prompt-search');
  const resultCount = document.getElementById('result-count');
  const noResults = document.querySelector('[data-no-results]');
  const showMore = document.querySelector('[data-show-more]');
  const showMoreButton = document.querySelector('[data-show-more-button]');
  const showMoreNote = document.querySelector('[data-show-more-note]');
  const activeFilters = document.querySelector('[data-active-filters]');
  const selectedCount = document.querySelector('[data-selected-count]');
  const promptsSection = document.getElementById('prompts');
  const tagGroups = new Map(filterButtons.map(button => [button.dataset.tag, button.dataset.tagGroup]));
  const tagLabels = new Map(filterButtons.map(button => [button.dataset.tag, button.querySelector('span')?.textContent ?? button.dataset.tag]));
  const selectedByGroup = new Map();
  let visibleLimit = PAGE_SIZE;
  let pendingSearchFrame;

  // 各分類の中では件数の多いタグを先に並べます。
  filterGroups.forEach(group => {
    const options = group.querySelector('.filter-options');
    if (!options) return;
    [...options.querySelectorAll('[data-tag]')]
      .sort((a, b) => Number(b.dataset.tagCount) - Number(a.dataset.tagCount))
      .forEach(button => options.appendChild(button));
  });

  function selectedTags(group) {
    if (!selectedByGroup.has(group)) selectedByGroup.set(group, new Set());
    return selectedByGroup.get(group);
  }

  function resetSelectedTags() {
    selectedByGroup.clear();
  }

  function allSelectedTags() {
    return [...selectedByGroup.values()].flatMap(tags => [...tags]).sort();
  }

  function hasActiveTags() {
    return allSelectedTags().length > 0;
  }

  function matchesSelectedTags(card) {
    return [...selectedByGroup.values()].every(tags => (
      tags.size === 0 || [...tags].some(tag => card.tags.has(tag))
    ));
  }

  function currentQueryTokens() {
    return normalize(searchInput?.value).split(' ').filter(Boolean);
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  const numericPatterns = new Map();

  function matchesNumericToken(card, token) {
    const value = Number(token);
    if (card.bpm && value >= card.bpm[0] - BPM_TOLERANCE && value <= card.bpm[1] + BPM_TOLERANCE) return true;

    if (!numericPatterns.has(token)) numericPatterns.set(token, new RegExp(`(?<!\\d)${escapeRegExp(token)}(?!\\d)`));
    return numericPatterns.get(token).test(card.searchText);
  }

  function matchesToken(card, token) {
    if (/^\d{2,3}$/.test(token)) return matchesNumericToken(card, token);
    const terms = synonyms.get(token) ?? [token];
    return [...terms].some(term => card.searchText.includes(term));
  }

  function syncControls() {
    filterButtons.forEach(button => {
      const selected = selectedTags(button.dataset.tagGroup).has(button.dataset.tag);
      button.setAttribute('aria-pressed', String(selected));
    });

    filterGroups.forEach(group => {
      const count = selectedTags(group.dataset.filterGroup).size;
      const badge = group.querySelector('[data-group-selected]');
      if (!badge) return;
      badge.hidden = count === 0;
      badge.textContent = count === 0 ? '' : `${count}件選択中`;
    });

    const selected = allSelectedTags();
    if (activeFilters) {
      activeFilters.replaceChildren(...selected.map(tag => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'active-filter';
        button.dataset.removeTag = tag;
        button.setAttribute('aria-label', `${tagLabels.get(tag)}の選択を解除`);
        button.textContent = tagLabels.get(tag) ?? tag;
        item.appendChild(button);
        return item;
      }));
      activeFilters.hidden = selected.length === 0;
    }
    if (selectedCount) {
      selectedCount.hidden = selected.length === 0;
      selectedCount.textContent = String(selected.length);
    }

    const active = selected.length > 0 || currentQueryTokens().length > 0;
    clearButtons.forEach(button => { button.disabled = !active; });
  }

  function filterCards() {
    const queryTokens = currentQueryTokens();
    let matchedCount = 0;
    let shownCount = 0;

    cards.forEach(card => {
      const matches = matchesSelectedTags(card) && queryTokens.every(token => matchesToken(card, token));
      if (matches) matchedCount += 1;
      const shown = matches && matchedCount <= visibleLimit;
      if (shown) shownCount += 1;
      card.element.hidden = !shown;
    });

    if (resultCount) resultCount.textContent = `${matchedCount} / ${cards.length} 件`;
    if (noResults) noResults.hidden = matchedCount !== 0;
    if (showMore) {
      const remaining = matchedCount - shownCount;
      showMore.hidden = remaining <= 0;
      if (showMoreNote) showMoreNote.textContent = `${matchedCount}件中 ${shownCount}件を表示しています。`;
      if (showMoreButton) showMoreButton.textContent = `さらに${Math.min(PAGE_SIZE, remaining)}件を表示（残り${remaining}件）`;
    }
    syncControls();
  }

  function writeUrl(mode) {
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    url.searchParams.delete('tag');

    const query = searchInput?.value.trim();
    if (query) url.searchParams.set('q', query);
    allSelectedTags().forEach(tag => url.searchParams.append('tag', tag));

    try {
      window.history[mode]({}, '', url);
    } catch {
      // file:// などHistory APIが制限された環境でも検索処理は継続します。
    }
  }

  function applyFilter(historyMode) {
    visibleLimit = PAGE_SIZE;
    filterCards();
    if (historyMode) writeUrl(historyMode);
  }

  function restoreFromUrl() {
    resetSelectedTags();
    const params = new URL(window.location.href).searchParams;

    if (searchInput) searchInput.value = params.get('q') ?? '';
    params.getAll('tag').forEach(tag => {
      const group = tagGroups.get(tag);
      if (group) selectedTags(group).add(tag);
    });

    filterGroups.forEach(group => {
      if (selectedTags(group.dataset.filterGroup).size > 0) group.open = true;
    });
  }

  function scrollToResults() {
    promptsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tags = selectedTags(button.dataset.tagGroup);
      const tag = button.dataset.tag;
      if (tags.has(tag)) tags.delete(tag);
      else tags.add(tag);
      applyFilter('pushState');
    });
  });

  activeFilters?.addEventListener('click', event => {
    const button = event.target.closest('[data-remove-tag]');
    if (!button) return;
    const tag = button.dataset.removeTag;
    const group = tagGroups.get(tag);
    if (!group) return;
    selectedTags(group).delete(tag);
    applyFilter('pushState');
    searchInput?.focus();
  });

  cardTagLinks.forEach(link => {
    link.addEventListener('click', event => {
      const group = tagGroups.get(link.dataset.cardTag);
      if (!group) return;

      event.preventDefault();
      selectedTags(group).add(link.dataset.cardTag);
      applyFilter('pushState');
      scrollToResults();
    });
  });

  searchInput?.addEventListener('input', () => {
    window.cancelAnimationFrame(pendingSearchFrame);
    pendingSearchFrame = window.requestAnimationFrame(() => applyFilter('replaceState'));
  });

  clearButtons.forEach(button => {
    button.addEventListener('click', () => {
      resetSelectedTags();
      if (searchInput) searchInput.value = '';
      applyFilter('pushState');
      searchInput?.focus();
    });
  });

  showMoreButton?.addEventListener('click', () => {
    const previouslyShown = cards.filter(card => !card.element.hidden).length;
    visibleLimit += PAGE_SIZE;
    filterCards();
    const revealed = cards.filter(card => !card.element.hidden)[previouslyShown];
    const heading = revealed?.element.querySelector('h3');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      revealed.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  window.addEventListener('popstate', () => {
    restoreFromUrl();
    applyFilter();
  });

  restoreFromUrl();
  applyFilter();
})();
