'use strict';

(() => {
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

  const catalog = document.querySelector('[data-catalog]');
  if (!catalog) return;

  const cards = [...document.querySelectorAll('[data-prompt-card]')].map(element => ({
    element,
    tags: new Set(element.dataset.tags.split(/\s+/).filter(Boolean)),
    searchText: normalize(element.dataset.search)
  }));
  const filterButtons = [...catalog.querySelectorAll('[data-tag]')];
  const cardTagLinks = [...document.querySelectorAll('[data-card-tag]')];
  const clearButtons = [...document.querySelectorAll('[data-clear-filter]')];
  const searchInput = document.getElementById('prompt-search');
  const resultCount = document.getElementById('result-count');
  const noResults = document.querySelector('[data-no-results]');
  const tagGroups = new Map(filterButtons.map(button => [button.dataset.tag, button.dataset.tagGroup]));
  const selectedByGroup = new Map();
  let pendingSearchFrame;

  function selectedTags(group) {
    if (!selectedByGroup.has(group)) selectedByGroup.set(group, new Set());
    return selectedByGroup.get(group);
  }

  function resetSelectedTags() {
    selectedByGroup.clear();
  }

  function hasActiveTags() {
    return [...selectedByGroup.values()].some(tags => tags.size > 0);
  }

  function matchesSelectedTags(card) {
    return [...selectedByGroup.values()].every(tags => (
      tags.size === 0 || [...tags].some(tag => card.tags.has(tag))
    ));
  }

  function currentQueryTokens() {
    return normalize(searchInput?.value).split(' ').filter(Boolean);
  }

  function syncControls() {
    filterButtons.forEach(button => {
      const selected = selectedTags(button.dataset.tagGroup).has(button.dataset.tag);
      button.setAttribute('aria-pressed', String(selected));
    });

    const active = hasActiveTags() || currentQueryTokens().length > 0;
    clearButtons.forEach(button => { button.disabled = !active; });
  }

  function filterCards() {
    const queryTokens = currentQueryTokens();
    let visibleCount = 0;

    cards.forEach(card => {
      const matchesQuery = queryTokens.every(token => card.searchText.includes(token));
      const visible = matchesQuery && matchesSelectedTags(card);
      card.element.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (resultCount) resultCount.textContent = `${visibleCount} / ${cards.length} 件`;
    if (noResults) noResults.hidden = visibleCount !== 0;
    syncControls();
  }

  function writeUrl(mode) {
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    url.searchParams.delete('tag');

    const query = searchInput?.value.trim();
    if (query) url.searchParams.set('q', query);

    [...selectedByGroup.values()]
      .flatMap(tags => [...tags])
      .sort()
      .forEach(tag => url.searchParams.append('tag', tag));

    try {
      window.history[mode]({}, '', url);
    } catch {
      // file:// などHistory APIが制限された環境でも検索処理は継続します。
    }
  }

  function applyFilter(historyMode) {
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

  cardTagLinks.forEach(link => {
    link.addEventListener('click', event => {
      const group = tagGroups.get(link.dataset.cardTag);
      if (!group) return;

      event.preventDefault();
      selectedTags(group).add(link.dataset.cardTag);
      applyFilter('pushState');
      catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  window.addEventListener('popstate', () => {
    restoreFromUrl();
    applyFilter();
  });

  restoreFromUrl();
  applyFilter();
})();
