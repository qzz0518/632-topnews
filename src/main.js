import './style.css';

// ============================================================
// Configuration
// ============================================================

const REGIONS = {
  cn: { name: '中国', tag: 'CN', source: '头条', api: '/api/toutiao', type: 'toutiao', dotColor: 'var(--color-red)' },
  jp: { name: '日本', tag: 'JP', source: 'NHK',  api: '/api/nhk',     type: 'rss',     dotColor: 'var(--color-blue)' },
  us: { name: 'USA',  tag: 'US', source: 'CNN',  api: '/api/cnn',     type: 'rss',     dotColor: 'var(--color-yellow)' },
  uk: { name: 'UK',   tag: 'UK', source: 'BBC',  api: '/api/bbc',     type: 'rss',     dotColor: 'var(--color-green)' },
};

const CATEGORY_KEYWORDS = {
  tech:          ['科技','技术','AI','人工智能','芯片','5G','软件','互联网','手机','tech','ai','robot','software','digital','cyber','quantum','semiconductor','internet','computer','data','chip','startup'],
  business:      ['财经','经济','金融','股市','投资','市值','贸易','GDP','economy','market','trade','finance','stock','bank','invest','inflation','rate','growth','fund','tax','business','deal','revenue'],
  sports:        ['体育','足球','篮球','比赛','奥运','电竞','sport','football','soccer','basketball','tennis','olympic','championship','league','premier','nba','fifa','match','athlete','tournament','cricket','rugby'],
  entertainment: ['娱乐','明星','电影','音乐','综艺','网红','entertainment','movie','film','music','celebrity','award','oscar','concert','album','game','gaming','anime','manga','festival','broadway','netflix'],
};

const MOCK_NEWS = {
  cn: [
    { title: '中国空间站科学实验取得重要阶段性进展', url: '#', source: '新华社' },
    { title: '2026年全国春季招聘市场需求旺盛', url: '#', source: '人民日报' },
    { title: '新能源汽车出口量同比增长45%创历史新高', url: '#', source: '经济日报' },
    { title: '量子计算领域研究取得突破性成果', url: '#', source: '科技日报' },
    { title: '长三角一体化发展战略再添新引擎', url: '#', source: '解放日报' },
    { title: '全国文旅市场春季消费热度持续攀升', url: '#', source: '中国青年报' },
  ],
  jp: [
    { title: 'Japan Launches Ambitious New Semiconductor Strategy for 2026', url: '#', source: 'NHK' },
    { title: 'Cherry Blossom Season Arrives Weeks Early Across Japan', url: '#', source: 'Asahi' },
    { title: 'Bank of Japan Signals Potential Shift in Monetary Policy', url: '#', source: 'Nikkei' },
    { title: 'Tokyo Olympic Legacy Venues Report Record Visitor Numbers', url: '#', source: 'NHK' },
    { title: 'Japanese AI Startup Raises Record $2B Series C Funding', url: '#', source: 'TechCrunch JP' },
    { title: 'Shinkansen High-Speed Network Expansion Plans Announced', url: '#', source: 'Yomiuri' },
  ],
  us: [
    { title: 'Federal Reserve Holds Rates Steady Amid Economic Uncertainty', url: '#', source: 'Reuters' },
    { title: 'SpaceX Successfully Completes Historic Mars Mission Launch', url: '#', source: 'CNN' },
    { title: 'US Tech Giants Report Stronger Than Expected Q1 Earnings', url: '#', source: 'WSJ' },
    { title: 'New Comprehensive Climate Policy Framework Signed Into Law', url: '#', source: 'AP' },
    { title: 'NBA Playoffs Heat Up With Surprising First-Round Upsets', url: '#', source: 'ESPN' },
    { title: 'Silicon Valley Leads Global AI Investment Surge in 2026', url: '#', source: 'TechCrunch' },
  ],
  uk: [
    { title: 'UK Parliament Passes Landmark Digital Safety and AI Bill', url: '#', source: 'BBC' },
    { title: 'London Emerges as Europe\'s Leading Fintech Capital', url: '#', source: 'FT' },
    { title: 'Premier League Title Race Enters Thrilling Final Stretch', url: '#', source: 'Sky Sports' },
    { title: 'UK-EU Trade Relations Enter New Chapter of Cooperation', url: '#', source: 'Guardian' },
    { title: 'British Scientists Achieve Major Fusion Energy Milestone', url: '#', source: 'BBC' },
    { title: 'NHS Digital Health Transformation Plan Unveiled', url: '#', source: 'Telegraph' },
  ],
};

// ============================================================
// State
// ============================================================

let activeRegion = 'all';
let activeCategory = 'all';
let newsStore = {};   // { cn: [...], jp: [...], us: [...], uk: [...] }
let favorites = loadFavorites();
let tickerInterval = null;
let tickerIndex = 0;

// ============================================================
// Initialization
// ============================================================

document.addEventListener('DOMContentLoaded', init);

function init() {
  setupRegionButtons();
  setupCategoryButtons();
  fetchAllNews();
}

// ============================================================
// Region Buttons
// ============================================================

function setupRegionButtons() {
  document.querySelectorAll('.hardware-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const region = btn.dataset.region;
      const wasActive = btn.classList.contains('is-active');

      document.querySelectorAll('.hardware-btn').forEach(b => b.classList.remove('is-active'));

      if (wasActive && region !== 'all') {
        activeRegion = 'all';
        document.querySelector('.hardware-btn[data-region="all"]').classList.add('is-active');
      } else {
        activeRegion = region;
        btn.classList.add('is-active');
      }

      renderNews();
    });
  });
}

// ============================================================
// Category Buttons
// ============================================================

function setupCategoryButtons() {
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      renderNews();
    });
  });
}

// ============================================================
// News Fetching
// ============================================================

async function fetchAllNews() {
  updateScreenStatus('CONNECTING');

  const regions = Object.keys(REGIONS);
  const results = await Promise.allSettled(
    regions.map(r => fetchRegionNews(r))
  );

  regions.forEach((region, i) => {
    if (results[i].status === 'fulfilled' && results[i].value.length > 0) {
      newsStore[region] = results[i].value;
    } else {
      newsStore[region] = buildMockItems(region);
    }
  });

  updateScreenStatus('ACTIVE');
  document.getElementById('screen-dot').classList.add('active');

  renderNews();
  startTicker();
  startProgressBar();
}

async function fetchRegionNews(region) {
  const config = REGIONS[region];
  const response = await fetch(config.api);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  if (config.type === 'toutiao') {
    const data = await response.json();
    if (data.code !== 200 || !Array.isArray(data.data)) throw new Error('Bad response');
    return data.data.map(item => ({
      id: `cn-${hashStr(item.title)}`,
      title: item.title,
      url: item.url || '#',
      source: '头条',
      region: 'cn',
      timestamp: item.timestamp ? parseInt(item.timestamp) / 1e6 : Date.now(),
      hot: item.hot,
    }));
  }

  if (config.type === 'rss') {
    const text = await response.text();
    return parseRSS(text, region);
  }

  return [];
}

function parseRSS(xmlText, region) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');

  if (doc.querySelector('parsererror')) return [];

  const items = doc.querySelectorAll('item');
  return Array.from(items).slice(0, 20).map(item => {
    const title = item.querySelector('title')?.textContent?.trim() || '';
    const link = item.querySelector('link')?.textContent?.trim() || '#';
    const pubDate = item.querySelector('pubDate')?.textContent || '';

    return {
      id: `${region}-${hashStr(title)}`,
      title,
      url: link,
      source: REGIONS[region].source,
      region,
      timestamp: pubDate ? new Date(pubDate).getTime() : Date.now(),
    };
  }).filter(item => item.title);
}

function buildMockItems(region) {
  const now = Date.now();
  return (MOCK_NEWS[region] || []).map((item, i) => ({
    id: `${region}-mock-${i}`,
    title: item.title,
    url: item.url || '#',
    source: item.source,
    region,
    timestamp: now - (i + 1) * 3600000,
  }));
}

// ============================================================
// Rendering
// ============================================================

function renderNews() {
  const grid = document.getElementById('news-grid');
  let items = getFilteredItems();

  grid.innerHTML = '';

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="feed-empty">
        <div class="feed-empty-text">${activeCategory === 'favorite' ? '[ NO FAVORITES YET ]' : '[ NO DATA FOR CURRENT FILTER ]'}</div>
      </div>`;
    updateFeedCount(0);
    return;
  }

  items.sort((a, b) => b.timestamp - a.timestamp);

  items.forEach(item => {
    grid.appendChild(createCard(item));
  });

  updateFeedCount(items.length);
}

function getFilteredItems() {
  let items = [];

  if (activeRegion === 'all') {
    Object.values(newsStore).forEach(arr => items.push(...arr));
  } else if (newsStore[activeRegion]) {
    items = [...newsStore[activeRegion]];
  }

  if (activeCategory === 'favorite') {
    items = items.filter(item => favorites.includes(item.id));
  } else if (activeCategory !== 'all' && CATEGORY_KEYWORDS[activeCategory]) {
    const keywords = CATEGORY_KEYWORDS[activeCategory];
    items = items.filter(item => {
      const text = item.title.toLowerCase();
      return keywords.some(kw => text.includes(kw.toLowerCase()));
    });
  }

  return items;
}

function createCard(item) {
  const card = document.createElement('div');
  card.className = `news-card region-${item.region}`;

  const isFav = favorites.includes(item.id);
  const regionConf = REGIONS[item.region] || {};

  card.innerHTML = `
    <div class="card-body">
      <div class="card-top">
        <div class="card-region">
          <span class="region-dot" style="background:${regionConf.dotColor || '#999'}"></span>
          <span class="region-tag">${regionConf.tag || '??'}</span>
        </div>
        <button class="card-fav-btn" data-id="${item.id}" title="${isFav ? 'Remove favorite' : 'Add favorite'}">
          <svg viewBox="0 0 24 24">
            <path class="${isFav ? 'star-filled' : 'star-outline'}" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      </div>
      <div class="card-title">${escapeHTML(item.title)}</div>
      <div class="card-meta">
        <span class="card-source">${escapeHTML(item.source || '')}</span>
        <span class="card-time">${timeAgo(item.timestamp)}</span>
      </div>
    </div>`;

  card.addEventListener('click', (e) => {
    if (e.target.closest('.card-fav-btn')) return;
    if (item.url && item.url !== '#') window.open(item.url, '_blank');
  });

  card.querySelector('.card-fav-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(item.id);
    renderNews();
  });

  return card;
}

function updateFeedCount(count) {
  document.getElementById('feed-count').textContent = `// ${count} ITEM${count !== 1 ? 'S' : ''}`;
}

// ============================================================
// CRT Ticker
// ============================================================

function startTicker() {
  if (tickerInterval) clearInterval(tickerInterval);

  const allItems = [];
  Object.values(newsStore).forEach(arr => {
    arr.slice(0, 3).forEach(item => allItems.push(item.title));
  });

  if (allItems.length === 0) return;

  tickerIndex = 0;
  showTickerItem(allItems);

  tickerInterval = setInterval(() => {
    tickerIndex = (tickerIndex + 1) % allItems.length;
    showTickerItem(allItems);
  }, 6000);
}

function showTickerItem(items) {
  const el = document.getElementById('news-ticker');
  const text = items[tickerIndex];
  el.innerHTML = '<span class="prompt">&gt;</span> ';

  let charIdx = 0;
  const typeInterval = setInterval(() => {
    if (charIdx < text.length) {
      el.innerHTML = `<span class="prompt">&gt;</span> ${escapeHTML(text.substring(0, charIdx + 1))}<span class="blink">_</span>`;
      charIdx++;
    } else {
      el.innerHTML = `<span class="prompt">&gt;</span> ${escapeHTML(text)}`;
      clearInterval(typeInterval);
    }
  }, 25);
}

function updateScreenStatus(status) {
  document.getElementById('feed-status').textContent = status;
}

// ============================================================
// Progress Bar (auto-refresh visual)
// ============================================================

function startProgressBar() {
  const bar = document.getElementById('refresh-progress');
  bar.classList.add('active');
  let pct = 0;

  const interval = setInterval(() => {
    pct += 0.33;
    bar.style.width = Math.min(pct, 100) + '%';

    if (pct >= 100) {
      clearInterval(interval);
      bar.style.width = '0%';
      bar.classList.remove('active');
      setTimeout(() => {
        fetchAllNews();
      }, 300);
    }
  }, 100);
}

// ============================================================
// Favorites
// ============================================================

function toggleFavorite(id) {
  const idx = favorites.indexOf(id);
  if (idx === -1) {
    favorites.push(id);
  } else {
    favorites.splice(idx, 1);
  }
  saveFavorites();
}

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem('newsFavorites') || '[]');
  } catch {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem('newsFavorites', JSON.stringify(favorites));
}

// ============================================================
// Utilities
// ============================================================

function hashStr(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function timeAgo(timestamp) {
  if (!timestamp) return '';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'JUST NOW';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}M AGO`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}H AGO`;
  return `${Math.floor(seconds / 86400)}D AGO`;
}
