// 天气API配置
const WEATHER_API_KEY = 'be5683664d2457ccbe332f61854b5504';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// 新闻API配置
const NEWS_API_URL = 'https://whyta.cn/api/toutiao';
const NEWS_API_KEY = '36de5db81215'; // 今日头条API的密钥
// CORS代理URL，用于解决跨域问题
const CORS_PROXY = 'https://corsproxy.io/?key=492fd778&url=';

// 当前活跃的新闻分类
let activeCategory = 'general';

// 存储所有新闻数据
let allNewsData = [];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 初始化天气信息
    initWeather();
    
    // 初始化新闻分类按钮事件
    initCategoryButtons();
    
    // 加载默认分类的新闻
    fetchNews(activeCategory);
});

// 初始化天气信息
async function initWeather() {
    try {
        // 获取用户位置
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                fetchWeather(latitude, longitude);
            }, handleLocationError);
        } else {
            throw new Error('您的浏览器不支持地理位置功能');
        }
    } catch (error) {
        showWeatherError(error.message);
    }
}

// 获取天气数据
async function fetchWeather(latitude, longitude) {
    try {
        const data = {
            name: '北京',
            main: { temp: 22 },
            weather: [{ description: '晴朗', icon: '01d' }]
        };
        
        updateWeatherUI(data);
    } catch (error) {
        showWeatherError('无法获取天气信息');
    }
}

// 更新天气UI
function updateWeatherUI(data) {
    const weatherInfo = document.getElementById('weather-info');
    const loadingWeather = document.getElementById('loading-weather');
    
    document.getElementById('location').textContent = data.name;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('weather-desc').textContent = data.weather[0].description;
    
    // 设置天气图标
    const weatherIcon = document.getElementById('weather-icon');
    
    // 根据天气代码设置对应的FontAwesome图标
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
    
    // 显示天气信息，隐藏加载提示
    loadingWeather.classList.add('hidden');
    weatherInfo.classList.remove('hidden');
}

// 处理位置获取错误
function handleLocationError(error) {
    let errorMessage;
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = '用户拒绝了位置请求';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = '位置信息不可用';
            break;
        case error.TIMEOUT:
            errorMessage = '获取位置请求超时';
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = '发生未知错误';
            break;
    }
    showWeatherError(errorMessage);
}

// 显示天气错误
function showWeatherError(message) {
    const loadingWeather = document.getElementById('loading-weather');
    loadingWeather.textContent = `${message}，使用默认位置`;
    
    // 使用默认位置的天气（北京）
    fetchWeather(39.9042, 116.4074);
}

// 初始化分类按钮事件
function initCategoryButtons() {
    // 在已有分类按钮后添加"收藏"分类
    const categoriesDiv = document.querySelector('.news-categories');
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'category-btn';
    favoriteBtn.dataset.category = 'favorite';
    favoriteBtn.innerHTML = '<i class="fas fa-star"></i> 收藏';
    categoriesDiv.appendChild(favoriteBtn);
    
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active类
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // 给当前点击的按钮添加active类
            button.classList.add('active');
            
            // 获取按钮对应的分类
            const category = button.dataset.category;
            activeCategory = category;
            
            // 获取该分类的新闻
            if (category === 'favorite') {
                displayFavoriteNews();
            } else {
                fetchNews(category);
            }
        });
    });
}

// 获取新闻数据
async function fetchNews(category) {
    try {
        const newsCards = document.getElementById('news-cards');
        const loadingNews = document.getElementById('loading-news');
        
        // 显示加载提示，隐藏新闻卡片
        newsCards.classList.add('hidden');
        loadingNews.classList.remove('hidden');
        
        // 使用CORS代理获取今日头条API数据
        const proxyUrl = `${CORS_PROXY}${encodeURIComponent(`${NEWS_API_URL}?key=${NEWS_API_KEY}`)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (data.code !== 200 || !data.data || !Array.isArray(data.data)) {
            throw new Error('获取新闻失败');
        }
        
        // 保存所有新闻数据
        allNewsData = data.data;
        
        // 根据选择的分类过滤或显示所有新闻
        let filteredNews = filterNewsByCategory(data.data, category);
        
        // 更新新闻UI
        updateNewsUI(filteredNews);
        
        // 隐藏加载提示，显示新闻卡片
        loadingNews.classList.add('hidden');
        newsCards.classList.remove('hidden');
    } catch (error) {
        const loadingNews = document.getElementById('loading-news');
        loadingNews.textContent = '获取新闻失败，请稍后再试';
        console.error('获取新闻错误:', error);
    }
}

function filterNewsByCategory(news, category) {
    const keywordsMap = {
        'technology': ['科技', '互联网', '手机', '芯片', '5G', '人工智能', 'AI', '软件'],
        'business': ['财经', '经济', '股市', '金融', '投资', '港元', '市值'],
        'entertainment': ['娱乐', '明星', '电影', '音乐', '综艺', '网红'],
        'sports': ['体育', '足球', '篮球', '比赛', '奥运', '电竞']
    };
    
    if (category === 'general') {
        // 综合分类显示所有新闻
        return news;
    } else if (keywordsMap[category]) {
        // 根据关键词过滤
        const keywords = keywordsMap[category];
        return news.filter(item => {
            const title = item.title || '';
            return keywords.some(keyword => title.includes(keyword));
        });
    }
    
    // 默认返回所有新闻
    return news;
}

function displayFavoriteNews() {
    try {
        const newsCards = document.getElementById('news-cards');
        const loadingNews = document.getElementById('loading-news');
        
        // 显示加载提示，隐藏新闻卡片
        newsCards.classList.add('hidden');
        loadingNews.classList.remove('hidden');
        
        // 从localStorage获取收藏的新闻ID列表
        const favoriteIds = getFavoriteNewsIds();
        
        // 如果没有收藏新闻或者没有新闻数据，显示空状态
        if (favoriteIds.length === 0 || allNewsData.length === 0) {
            updateNewsUI([]);
            loadingNews.classList.add('hidden');
            newsCards.classList.remove('hidden');
            return;
        }
        
        // 根据ID筛选收藏的新闻
        const favoriteNews = allNewsData.filter(news => favoriteIds.includes(news.id));
        
        // 更新新闻UI
        updateNewsUI(favoriteNews);
        
        // 隐藏加载提示，显示新闻卡片
        loadingNews.classList.add('hidden');
        newsCards.classList.remove('hidden');
    } catch (error) {
        const loadingNews = document.getElementById('loading-news');
        loadingNews.textContent = '获取收藏新闻失败，请稍后再试';
        console.error('获取收藏新闻错误:', error);
    }
}

// 更新新闻UI
function updateNewsUI(articles) {
    const newsCards = document.getElementById('news-cards');
    newsCards.innerHTML = '';
    
    if (articles.length === 0) {
        if (activeCategory === 'favorite') {
            newsCards.innerHTML = '<div class="no-news">暂无收藏新闻</div>';
        } else {
            newsCards.innerHTML = '<div class="no-news">该分类暂无新闻</div>';
        }
        return;
    }
    
    // 获取收藏的新闻ID列表
    const favoriteIds = getFavoriteNewsIds();
    
    articles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.dataset.id = article.id;
        
        // 构建新闻卡片HTML
        let imageHtml = '';
        if (article.cover) {
            imageHtml = `<img src="${article.cover}" alt="${article.title}" class="news-card-img">`;
        } else {
            imageHtml = `<div class="news-card-img-placeholder">无图片</div>`;
        }
        
        // 格式化热度数据
        const hotFormatted = formatNumber(article.hot);
        
        // 检查当前新闻是否已收藏
        const isFavorite = favoriteIds.includes(article.id);
        const favoriteIconClass = isFavorite ? 'fas fa-star' : 'far fa-star';
        const favoriteIconTitle = isFavorite ? '取消收藏' : '收藏';
        
        card.innerHTML = `
            ${imageHtml}
            <div class="news-card-content">
                <div class="news-card-header">
                    <h3 class="news-card-title">${article.title}</h3>
                    <button class="favorite-btn" title="${favoriteIconTitle}">
                        <i class="${favoriteIconClass}"></i>
                    </button>
                </div>
                <div class="news-card-source">
                    <span>热度: ${hotFormatted}</span>
                    <span>${formatTimestamp(article.timestamp)}</span>
                </div>
            </div>
        `;
        
        // 将卡片添加到容器中
        newsCards.appendChild(card);
        
        // 添加收藏按钮点击事件
        const favoriteBtn = card.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击事件
            toggleFavorite(article.id);
            
            // 更新按钮图标
            const isFav = isFavoriteNews(article.id);
            favoriteBtn.innerHTML = `<i class="${isFav ? 'fas' : 'far'} fa-star"></i>`;
            favoriteBtn.title = isFav ? '取消收藏' : '收藏';
            
            // 如果当前在收藏分类，则从视图中移除该卡片
            if (activeCategory === 'favorite' && !isFav) {
                card.remove();
                
                // 检查是否还有剩余的收藏新闻
                if (newsCards.children.length === 0) {
                    newsCards.innerHTML = '<div class="no-news">暂无收藏新闻</div>';
                }
            }
        });
        
        // 添加卡片点击事件，打开新闻链接
        card.addEventListener('click', (e) => {
            // 如果点击的不是收藏按钮，则打开新闻链接
            if (!e.target.closest('.favorite-btn')) {
                window.open(article.url, '_blank');
            }
        });
    });
}

// 切换新闻收藏状态
function toggleFavorite(newsId) {
    const favoriteIds = getFavoriteNewsIds();
    const index = favoriteIds.indexOf(newsId);
    
    if (index === -1) {
        // 添加到收藏
        favoriteIds.push(newsId);
    } else {
        // 从收藏中移除
        favoriteIds.splice(index, 1);
    }
    
    // 保存更新后的收藏列表
    localStorage.setItem('favoriteNews', JSON.stringify(favoriteIds));
}

// 获取收藏的新闻ID列表
function getFavoriteNewsIds() {
    const favoriteNewsJson = localStorage.getItem('favoriteNews');
    return favoriteNewsJson ? JSON.parse(favoriteNewsJson) : [];
}

// 检查新闻是否已收藏
function isFavoriteNews(newsId) {
    const favoriteIds = getFavoriteNewsIds();
    return favoriteIds.includes(newsId);
}

// 格式化数字（热度）
function formatNumber(num) {
    if (!num) return '0';
    
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
}

// 格式化时间戳
function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    
    const currentYear = new Date().getFullYear();
    
    const date = new Date(parseInt(timestamp) / 1000000);
    if (isNaN(date.getTime())) {
        return '';
    }
    
    return `${currentYear}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
} 