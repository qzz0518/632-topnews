// ============================================================
// 热门新闻 - 多源新闻聚合器
// ============================================================

// ===== 配置 =====

const CONFIG = {
  sources: {
    toutiao: {
      name: '头条热榜',
      icon: 'fire',
      apis: [
        { url: 'https://api.vvhan.com/api/hotlist/toutiao', type: 'vvhan' },
        { url: 'https://whyta.cn/api/toutiao?key=36de5db81215', type: 'toutiao', needsProxy: true }
      ]
    },
    baidu: {
      name: '百度热搜',
      icon: 'search',
      apis: [
        { url: 'https://api.vvhan.com/api/hotlist/baiduRD', type: 'vvhan' }
      ]
    },
    weibo: {
      name: '微博热搜',
      icon: 'hashtag',
      apis: [
        { url: 'https://api.vvhan.com/api/hotlist/wbHot', type: 'vvhan' }
      ]
    },
    zhihu: {
      name: '知乎热榜',
      icon: 'lightbulb',
      apis: [
        { url: 'https://api.vvhan.com/api/hotlist/zhihuHot', type: 'vvhan' }
      ]
    }
  },
  corsProxies: [
    'https://corsproxy.io/?url=',
    'https://api.allorigins.win/raw?url='
  ],
  fetchTimeout: 8000,
  categoryKeywords: {
    technology: ['科技', '互联网', '手机', '芯片', '5G', '人工智能', 'AI', '软件', '量子', '机器人', '算法', 'GPU', '大模型', '智能'],
    business: ['财经', '经济', '股市', '金融', '投资', '市值', '楼市', '房地', '油价', '碳交易', '理财', 'GDP', '央行', '贸易'],
    entertainment: ['娱乐', '明星', '电影', '音乐', '综艺', '网红', '票房', '演唱会', '游戏', '剧', '动漫', '偶像'],
    sports: ['体育', '足球', '篮球', '比赛', '奥运', 'CBA', '中超', '冠军', '赛季', '世界杯', '联赛', 'NBA']
  }
};

const MOCK_DATA = {
  toutiao: [
    { id: 't1', title: '2026年政府工作报告：GDP增长目标设定为5.5%', desc: '全国两会期间，政府工作报告提出多项经济发展目标', hot: 9856000, url: '#', cover: null },
    { id: 't2', title: '国产大飞机C919完成首次跨大西洋商业航班', desc: '标志着中国民航制造业的重大里程碑', hot: 8742000, url: '#', cover: null },
    { id: 't3', title: '人工智能芯片突破：国产GPU性能首次超越国际竞品', desc: '自主研发的AI芯片在多项基准测试中领先', hot: 7635000, url: '#', cover: null },
    { id: 't4', title: '新能源汽车出口量再创新高，全年突破500万辆', desc: '中国新能源汽车产业持续领跑全球市场', hot: 6528000, url: '#', cover: null },
    { id: 't5', title: '月球科研站一期工程完工，中国航天迈入新时代', desc: '标志着中国深空探测能力达到世界领先水平', hot: 5421000, url: '#', cover: null },
    { id: 't6', title: '5G-A网络商用加速，覆盖全国80%以上城市', desc: '5G-Advanced技术带来更快速度和更低延迟', hot: 4314000, url: '#', cover: null },
    { id: 't7', title: '全国高铁运营总里程突破5万公里', desc: '新增多条跨区域高铁线路投入运营', hot: 3207000, url: '#', cover: null },
    { id: 't8', title: '春季档电影票房破百亿，国产影片占比超八成', desc: '多部国产大片获得口碑票房双丰收', hot: 2100000, url: '#', cover: null },
    { id: 't9', title: 'CBA季后赛激战正酣，多支球队争夺冠军', desc: '本赛季竞争格局发生重大变化', hot: 1893000, url: '#', cover: null },
    { id: 't10', title: '全国碳交易市场成交额突破万亿元', desc: '碳排放权交易助力双碳目标实现', hot: 1686000, url: '#', cover: null }
  ],
  baidu: [
    { id: 'b1', title: '大模型价格战升级：多家厂商宣布免费开放API', desc: 'AI行业竞争白热化', hot: 8965000, url: '#', cover: null },
    { id: 'b2', title: '2026年考研国家线公布，多学科分数线上涨', desc: '', hot: 7854000, url: '#', cover: null },
    { id: 'b3', title: '多地发布楼市新政，取消限购促进住房消费', desc: '', hot: 6743000, url: '#', cover: null },
    { id: 'b4', title: '国际油价大幅波动，成品油调价窗口将至', desc: '', hot: 5632000, url: '#', cover: null },
    { id: 'b5', title: '全球首个人形机器人工厂正式投产', desc: '', hot: 4521000, url: '#', cover: null },
    { id: 'b6', title: '2026年高考改革方案正式发布', desc: '', hot: 3410000, url: '#', cover: null },
    { id: 'b7', title: '量子计算机实现1000+量子比特里程碑', desc: '', hot: 2899000, url: '#', cover: null },
    { id: 'b8', title: '中超联赛新赛季盛大开幕，球迷热情高涨', desc: '', hot: 2388000, url: '#', cover: null },
    { id: 'b9', title: '国产手术机器人获FDA认证，进军国际市场', desc: '', hot: 1877000, url: '#', cover: null },
    { id: 'b10', title: '可控核聚变实验再获突破性进展', desc: '', hot: 1366000, url: '#', cover: null }
  ],
  weibo: [
    { id: 'w1', title: '#年度最佳电影评选# 网友票选结果出炉', desc: '', hot: 7856000, url: '#', cover: null },
    { id: 'w2', title: '#AI绘画著作权# 法院首次作出判决', desc: '', hot: 6745000, url: '#', cover: null },
    { id: 'w3', title: '#明星演唱会# 多位歌手开启全国巡演', desc: '', hot: 5634000, url: '#', cover: null },
    { id: 'w4', title: '#新型减肥药# GLP-1药物引发全网热议', desc: '', hot: 4523000, url: '#', cover: null },
    { id: 'w5', title: '#打工人下班自由# 话题引发全网讨论', desc: '', hot: 3412000, url: '#', cover: null },
    { id: 'w6', title: '#国产游戏出海# 多款手游登顶海外榜单', desc: '', hot: 2901000, url: '#', cover: null },
    { id: 'w7', title: '#考研成绩公布# 考生查分通道已开放', desc: '', hot: 2390000, url: '#', cover: null },
    { id: 'w8', title: '#数字人民币# 试点范围扩大至全国', desc: '', hot: 1879000, url: '#', cover: null },
    { id: 'w9', title: '#职场社交礼仪# 年轻人的职场生存指南', desc: '', hot: 1368000, url: '#', cover: null },
    { id: 'w10', title: '#宠物经济# 市场规模突破3000亿', desc: '', hot: 957000, url: '#', cover: null }
  ],
  zhihu: [
    { id: 'z1', title: '如何评价2026年人工智能领域的最新进展？', desc: '从GPT-5到国产大模型，AI正在深刻改变生活', hot: 6789000, url: '#', cover: null },
    { id: 'z2', title: '为什么越来越多年轻人选择回到二三线城市发展？', desc: '一线城市成本与二三线城市机遇的对比', hot: 5678000, url: '#', cover: null },
    { id: 'z3', title: '如何看待当前房地产市场的变化趋势？', desc: '专家解读2026年楼市走向', hot: 4567000, url: '#', cover: null },
    { id: 'z4', title: '有哪些看似冷门但前景极好的专业方向？', desc: '盘点未来十年最具潜力的专业', hot: 3456000, url: '#', cover: null },
    { id: 'z5', title: '量子计算对普通人的生活会有什么影响？', desc: '从理论到应用，量子计算的未来展望', hot: 2845000, url: '#', cover: null },
    { id: 'z6', title: '如何在30岁之前实现财务自由？', desc: '理财、投资和个人成长的深度思考', hot: 2334000, url: '#', cover: null },
    { id: 'z7', title: '2026年有哪些值得期待的科技产品？', desc: '折叠屏到AR眼镜，盘点即将发布的重磅新品', hot: 1823000, url: '#', cover: null },
    { id: 'z8', title: '独居生活有哪些提升幸福感的小技巧？', desc: '独居青年的生活美学', hot: 1312000, url: '#', cover: null },
    { id: 'z9', title: '怎样培养深度阅读的习惯？', desc: '碎片化时代保持深度思考的方法', hot: 901000, url: '#', cover: null },
    { id: 'z10', title: '新能源汽车和燃油车，现在买哪个更划算？', desc: '用车成本、保值率等多维度对比', hot: 790000, url: '#', cover: null }
  ]
};

// ===== 状态 =====

let activeSource = 'toutiao';
let activeCategory = 'general';
let allNewsData = [];
let isLiveData = false;
let darkMode = localStorage.getItem('darkMode') === 'true';

// ===== 初始化 =====

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initWeather();
  initSourceButtons();
  initCategoryButtons();
  fetchNews();
});

// ===== 主题 =====

function initTheme() {
  if (darkMode) {
    document.body.classList.add('dark-mode');
  }
  updateThemeIcon();

  const btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', darkMode);
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.querySelector('#theme-toggle i');
  if (icon) icon.className = darkMode ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== 天气 =====

function initWeather() {
  const mockWeather = {
    name: '北京',
    main: { temp: 22 },
    weather: [{ description: '晴朗', icon: '01d' }]
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      () => updateWeatherUI(mockWeather),
      () => updateWeatherUI(mockWeather)
    );
  } else {
    updateWeatherUI(mockWeather);
  }
}

function updateWeatherUI(data) {
  const weatherInfo = document.getElementById('weather-info');
  const loadingWeather = document.getElementById('loading-weather');

  document.getElementById('location').textContent = data.name;
  document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById('weather-desc').textContent = data.weather[0].description;

  const weatherIcon = document.getElementById('weather-icon');
  const iconMap = {
    '01d': 'sun', '01n': 'moon',
    '02d': 'cloud-sun', '02n': 'cloud-moon',
    '03d': 'cloud', '03n': 'cloud',
    '04d': 'cloud', '04n': 'cloud',
    '09d': 'cloud-showers-heavy', '09n': 'cloud-showers-heavy',
    '10d': 'cloud-sun-rain', '10n': 'cloud-moon-rain',
    '11d': 'bolt', '11n': 'bolt',
    '13d': 'snowflake', '13n': 'snowflake',
    '50d': 'smog', '50n': 'smog'
  };
  const icon = iconMap[data.weather[0].icon] || 'question';
  weatherIcon.innerHTML = `<i class="fas fa-${icon}"></i>`;

  if (loadingWeather) loadingWeather.classList.add('hidden');
  if (weatherInfo) weatherInfo.classList.remove('hidden');
}

// ===== 新闻源切换 =====

function initSourceButtons() {
  const btns = document.querySelectorAll('.source-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSource = btn.dataset.source;
      activeCategory = 'general';

      document.querySelectorAll('.category-btn').forEach(cb => cb.classList.remove('active'));
      const generalBtn = document.querySelector('.category-btn[data-category="general"]');
      if (generalBtn) generalBtn.classList.add('active');

      fetchNews();
    });
  });
}

// ===== 分类切换 =====

function initCategoryButtons() {
  const categoriesDiv = document.querySelector('.news-categories');
  const favoriteBtn = document.createElement('button');
  favoriteBtn.className = 'category-btn';
  favoriteBtn.dataset.category = 'favorite';
  favoriteBtn.innerHTML = '<i class="fas fa-star"></i> 收藏';
  categoriesDiv.appendChild(favoriteBtn);

  const btns = document.querySelectorAll('.category-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;

      if (activeCategory === 'favorite') {
        displayFavoriteNews();
      } else {
        displayFilteredNews();
      }
    });
  });
}

// ===== 新闻获取 =====

async function fetchNews() {
  const newsCards = document.getElementById('news-cards');
  const loadingNews = document.getElementById('loading-news');

  newsCards.classList.add('hidden');
  loadingNews.classList.remove('hidden');
  showLoadingSkeleton();

  const sourceConfig = CONFIG.sources[activeSource];
  let data = null;

  for (const api of sourceConfig.apis) {
    try {
      data = await tryFetchFromApi(api);
      if (data && data.length > 0) {
        isLiveData = true;
        break;
      }
    } catch (e) {
      console.warn(`API ${api.url} failed:`, e.message);
    }
  }

  if (!data || data.length === 0) {
    data = MOCK_DATA[activeSource] || [];
    isLiveData = false;
  }

  allNewsData = data;
  updateDataSourceBadge();
  displayFilteredNews();

  loadingNews.classList.add('hidden');
  newsCards.classList.remove('hidden');
}

async function tryFetchFromApi(api) {
  const urls = [api.url];

  CONFIG.corsProxies.forEach(proxy => {
    urls.push(proxy + encodeURIComponent(api.url));
  });

  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), CONFIG.fetchTimeout);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) continue;

      const json = await response.json();
      const parsed = parseApiResponse(json, api.type);
      if (parsed && parsed.length > 0) return parsed;
    } catch (e) {
      continue;
    }
  }
  return null;
}

function parseApiResponse(json, type) {
  if (type === 'vvhan') {
    if (!json.success || !json.data) return null;
    return json.data.map((item, i) => ({
      id: `${activeSource}_${i}`,
      title: item.title || '',
      desc: item.desc || '',
      cover: item.pic || null,
      hot: parseHotValue(item.hot),
      url: item.url || item.mobilUrl || '#'
    }));
  }

  if (type === 'toutiao') {
    if (json.code !== 200 || !json.data) return null;
    return json.data.map(item => ({
      id: item.id || `toutiao_${Math.random().toString(36).substr(2, 9)}`,
      title: item.title || '',
      desc: '',
      cover: item.cover || null,
      hot: item.hot || 0,
      url: item.url || '#'
    }));
  }

  return null;
}

function parseHotValue(hot) {
  if (typeof hot === 'number') return hot;
  if (typeof hot === 'string') {
    const wanMatch = hot.match(/([\d.]+)\s*万/);
    if (wanMatch) return Math.round(parseFloat(wanMatch[1]) * 10000);
    const numMatch = hot.match(/([\d.]+)/);
    if (numMatch) return Math.round(parseFloat(numMatch[1]));
  }
  return 0;
}

// ===== 显示逻辑 =====

function displayFilteredNews() {
  const filtered = filterNewsByCategory(allNewsData, activeCategory);
  updateNewsUI(filtered);
}

function filterNewsByCategory(news, category) {
  if (category === 'general') return news;

  const keywords = CONFIG.categoryKeywords[category];
  if (!keywords) return news;

  return news.filter(item => {
    const text = (item.title || '') + (item.desc || '');
    return keywords.some(kw => text.includes(kw));
  });
}

function displayFavoriteNews() {
  updateNewsUI(getFavorites());
}

function updateNewsUI(articles) {
  const newsCards = document.getElementById('news-cards');
  newsCards.innerHTML = '';

  if (!articles || articles.length === 0) {
    const emptyMsg = activeCategory === 'favorite' ? '暂无收藏新闻' : '该分类暂无新闻';
    const emptyIcon = activeCategory === 'favorite' ? 'star' : 'newspaper';
    newsCards.innerHTML = `
      <div class="no-news">
        <i class="fas fa-${emptyIcon}"></i>
        <p>${emptyMsg}</p>
      </div>`;
    return;
  }

  const favoriteIds = getFavorites().map(f => f.id);
  const gradients = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    'linear-gradient(135deg, #fccb90, #d57eeb)',
    'linear-gradient(135deg, #e0c3fc, #8ec5fc)'
  ];

  articles.forEach((article, index) => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.style.animationDelay = `${index * 0.05}s`;

    const gradient = gradients[index % gradients.length];
    const isFav = favoriteIds.includes(article.id);
    const rankClass = index < 3 ? ` rank-${index + 1}` : '';

    let imageHtml;
    if (article.cover) {
      imageHtml = `
        <div class="news-card-img-wrap" style="background:${gradient}">
          <img src="${article.cover}" alt="" class="news-card-img" loading="lazy">
          <i class="fas fa-newspaper img-fallback-icon"></i>
        </div>`;
    } else {
      imageHtml = `
        <div class="news-card-img-placeholder" style="background:${gradient}">
          <i class="fas fa-newspaper"></i>
        </div>`;
    }

    card.innerHTML = `
      ${imageHtml}
      <div class="news-card-content">
        <div class="news-card-header">
          <span class="rank-badge${rankClass}">${index + 1}</span>
          <h3 class="news-card-title">${article.title}</h3>
          <button class="favorite-btn" title="${isFav ? '取消收藏' : '收藏'}">
            <i class="${isFav ? 'fas' : 'far'} fa-star"></i>
          </button>
        </div>
        ${article.desc ? `<p class="news-card-desc">${article.desc}</p>` : ''}
        <div class="news-card-meta">
          <span class="hot-value"><i class="fas fa-fire-alt"></i> ${formatNumber(article.hot)}</span>
          <span class="source-label">${CONFIG.sources[activeSource]?.name || ''}</span>
        </div>
      </div>`;

    newsCards.appendChild(card);

    const img = card.querySelector('.news-card-img');
    if (img) {
      img.addEventListener('error', () => {
        img.remove();
      });
    }

    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(article);
      const nowFav = isFavoriteNews(article.id);
      favoriteBtn.innerHTML = `<i class="${nowFav ? 'fas' : 'far'} fa-star"></i>`;
      favoriteBtn.title = nowFav ? '取消收藏' : '收藏';

      if (activeCategory === 'favorite' && !nowFav) {
        card.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
          card.remove();
          if (newsCards.children.length === 0) {
            newsCards.innerHTML = '<div class="no-news"><i class="fas fa-star"></i><p>暂无收藏新闻</p></div>';
          }
        }, 300);
      }
    });

    card.addEventListener('click', (e) => {
      if (!e.target.closest('.favorite-btn') && article.url && article.url !== '#') {
        window.open(article.url, '_blank');
      }
    });
  });
}

// ===== Loading Skeleton =====

function showLoadingSkeleton() {
  const loading = document.getElementById('loading-news');
  let html = '';
  for (let i = 0; i < 6; i++) {
    html += `
      <div class="skeleton-card">
        <div class="skeleton-img skeleton-shimmer"></div>
        <div class="skeleton-content">
          <div class="skeleton-title skeleton-shimmer"></div>
          <div class="skeleton-text skeleton-shimmer"></div>
          <div class="skeleton-meta skeleton-shimmer"></div>
        </div>
      </div>`;
  }
  loading.innerHTML = html;
}

// ===== Data Source Badge =====

function updateDataSourceBadge() {
  const badge = document.getElementById('data-source-badge');
  if (badge) {
    badge.textContent = isLiveData ? '✦ 实时数据' : '✦ 演示数据';
    badge.className = `badge ${isLiveData ? 'badge-live' : 'badge-demo'}`;
  }
}

// ===== 收藏管理 =====

function toggleFavorite(article) {
  let favorites = getFavorites();
  const index = favorites.findIndex(f => f.id === article.id);
  if (index === -1) {
    favorites.push({ ...article });
  } else {
    favorites.splice(index, 1);
  }
  localStorage.setItem('favoriteNews', JSON.stringify(favorites));
}

function getFavorites() {
  const json = localStorage.getItem('favoriteNews');
  if (!json) return [];
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
      localStorage.removeItem('favoriteNews');
      return [];
    }
    return data;
  } catch {
    return [];
  }
}

function isFavoriteNews(id) {
  return getFavorites().some(f => f.id === id);
}

// ===== 工具函数 =====

function formatNumber(num) {
  if (!num) return '0';
  if (num >= 10000) return (num / 10000).toFixed(1) + '万';
  return num.toString();
}
