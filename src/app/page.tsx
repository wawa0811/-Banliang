'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createChart, CrosshairMode, CandlestickSeries } from 'lightweight-charts';

// -------------------- 多语言配置 --------------------
type Language = 'zh' | 'en';
const translations = {
  zh: {
    netWorth: '总资产',
    liveMarket: '实时行情',
    intelligence: '深度情报',
    buy: '买入',
    sell: '卖出',
    quantity: '份额',
    estimated: '约',
    cash: '现金',
    equity: '持仓市值',
    level: '经验等级',
    portfolio: '持仓构成',
    foodGallery: '美食图鉴',
    noPosition: '暂无持仓，开始你的第一笔交易吧',
    nextReward: '下一个奖励',
    snackIncubating: '点心孵化中',
    buyTea: '请程序员喝杯茶',
    supportDesc: '支持我们持续维护，解锁更多风味',
    treat: '投喂一杯',
    levelTitle: '投资等级',
    currentLevel: '当前等级',
    nextLevelExp: '距下一级还需',
    expRequired: '经验值',
    insufficientFunds: '资金匮乏，建议轻仓',
    insufficientShares: '持仓不足',
    login: '登录',
    register: '注册',
    username: '用户名',
    email: '邮箱',
    phone: '手机号',
    password: '密码',
    confirmPassword: '确认密码',
    bindWechat: '绑定微信',
    wechatPlaceholder: '微信OpenID',
    loginBtn: '登录',
    registerBtn: '注册',
    selectDrink: '选择饮品',
    iceAmericano: '冰美式',
    cappuccino: '卡布奇诺',
    caramelLatte: '焦糖冰镇浓缩',
    price: '价格',
    paymentMethod: '支付方式',
    wechatPay: '微信支付',
    alipay: '支付宝',
    visa: 'Visa',
    pay: '立即支付',
    paySuccess: '支付成功，感谢支持！',
    priceChart: '价格走势（K线图）',
    '1m': '1分钟',
    '10m': '10分钟',
    '1h': '1小时',
    '1d': '1天',
    '1mo': '1个月',
    '1y': '1年',
    searchStock: '搜索股票代码或名称',
    searchNews: '搜索新闻...',
    newsDetail: '新闻详情',
    source: '来源',
    date: '日期',
    fullText: '全文',
    backToList: '返回列表',
    tradeHistory: '交易历史',
    noHistory: '暂无交易记录',
    time: '时间',
    direction: '方向',
    buyDirection: '买入',
    sellDirection: '卖出',
    priceUnit: '价格',
    qtyUnit: '数量',
    totalAmount: '总额',
    symbol: '代码',
  },
  en: {
    netWorth: 'Net Worth',
    liveMarket: 'Live Market',
    intelligence: 'Intelligence',
    buy: 'Buy',
    sell: 'Sell',
    quantity: 'Quantity',
    estimated: 'Est.',
    cash: 'Cash',
    equity: 'Equity',
    level: 'Level',
    portfolio: 'Portfolio',
    foodGallery: 'Food Gallery',
    noPosition: 'No positions yet',
    nextReward: 'Next Reward',
    snackIncubating: 'Snack incubating...',
    buyTea: 'Buy the dev a tea',
    supportDesc: 'Unlock more flavors',
    treat: 'Treat',
    levelTitle: 'Investment Levels',
    currentLevel: 'Current Level',
    nextLevelExp: 'Next level in',
    expRequired: 'EXP',
    insufficientFunds: 'Insufficient Balance',
    insufficientShares: 'Insufficient Shares',
    login: 'Login',
    register: 'Register',
    username: 'Username',
    email: 'Email',
    phone: 'Phone',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    bindWechat: 'Bind WeChat',
    wechatPlaceholder: 'WeChat OpenID',
    loginBtn: 'Login',
    registerBtn: 'Register',
    selectDrink: 'Select Drink',
    iceAmericano: 'Iced Americano',
    cappuccino: 'Cappuccino',
    caramelLatte: 'Caramel Latte',
    price: 'Price',
    paymentMethod: 'Payment Method',
    wechatPay: 'WeChat Pay',
    alipay: 'Alipay',
    visa: 'Visa',
    pay: 'Pay Now',
    paySuccess: 'Payment successful!',
    priceChart: 'Price Chart (Candlestick)',
    '1m': '1m',
    '10m': '10m',
    '1h': '1h',
    '1d': '1d',
    '1mo': '1m',
    '1y': '1y',
    searchStock: 'Search symbol or name',
    searchNews: 'Search news...',
    newsDetail: 'News Detail',
    source: 'Source',
    date: 'Date',
    fullText: 'Full Text',
    backToList: 'Back',
    tradeHistory: 'Trade History',
    noHistory: 'No trades yet',
    time: 'Time',
    direction: 'Direction',
    buyDirection: 'Buy',
    sellDirection: 'Sell',
    priceUnit: 'Price',
    qtyUnit: 'Qty',
    totalAmount: 'Total',
    symbol: 'Symbol',
  }
};

// -------------------- 资产数据（15只股票）--------------------
const ASSETS = [
  { id: 'SPY', name: 'S&P 500', zone: '北美', price: 512.45, color: 'bg-[#557AFF]' },
  { id: 'QQQ', name: 'Nasdaq 100', zone: '北美', price: 445.2, color: 'bg-[#A355FF]' },
  { id: 'AAPL', name: 'Apple Inc.', zone: '北美', price: 175.30, color: 'bg-[#557AFF]' },
  { id: 'MSFT', name: 'Microsoft', zone: '北美', price: 420.80, color: 'bg-[#557AFF]' },
  { id: 'GOOGL', name: 'Alphabet', zone: '北美', price: 150.25, color: 'bg-[#557AFF]' },
  { id: 'TSLA', name: 'Tesla', zone: '北美', price: 175.60, color: 'bg-[#557AFF]' },
  { id: 'HSI', name: 'Hang Seng', zone: '亚洲', price: 16500, color: 'bg-[#FF5555]' },
  { id: 'N225', name: 'Nikkei 225', zone: '亚洲', price: 38500, color: 'bg-[#FFB355]' },
  { id: 'SSE', name: 'Shanghai Comp', zone: '亚洲', price: 3100, color: 'bg-[#FF5555]' },
  { id: 'DAX', name: 'DAX', zone: '欧洲', price: 17850, color: 'bg-[#55C2FF]' },
  { id: 'UKX', name: 'FTSE 100', zone: '欧洲', price: 7900, color: 'bg-[#55C2FF]' },
  { id: 'CAC', name: 'CAC 40', zone: '欧洲', price: 7600, color: 'bg-[#55C2FF]' },
  { id: 'BABA', name: 'Alibaba', zone: '亚洲', price: 75.40, color: 'bg-[#FF5555]' },
  { id: 'NVDA', name: 'NVIDIA', zone: '北美', price: 900.10, color: 'bg-[#557AFF]' },
  { id: 'AMD', name: 'AMD', zone: '北美', price: 150.20, color: 'bg-[#557AFF]' },
];

const FOOD_COLLECTION = [
  { icon: '🍵', name: '翠玉抹茶', desc: '心平气和，方能看透红绿', color: 'bg-[#E8F5E9]' },
  { icon: '🍇', name: '多肉葡萄', desc: '丰收时刻，持仓大吉', color: 'bg-[#F3E5F5]' },
  { icon: '🥐', name: '巧克力可颂', desc: '外酥里嫩，盈利爆浆', color: 'bg-[#FFF3E0]' },
  { icon: '🍓', name: '芝芝莓莓', desc: '甜美收益，生活微甜', color: 'bg-[#FFEBEE]' },
  { icon: '🥑', name: '能量牛油果', desc: '健康持仓，长线是金', color: 'bg-[#F1F8E9]' },
  { icon: '🍰', name: '云朵千层', desc: '轻盈获利，拒绝焦虑', color: 'bg-[#FCE4EC]' }
];

const LEVELS = [
  { threshold: 0, zh: '韭菜萌新', en: 'Sprout' },
  { threshold: 100, zh: '短线快手', en: 'Quick Hand' },
  { threshold: 500, zh: '华尔街学徒', en: 'Apprentice' },
  { threshold: 1000, zh: '半两大空头', en: 'Legendary' },
];

// -------------------- 扩展新闻数据（几百条 + 配图）--------------------
const NEWS_TEMPLATES = [
  { tag: '宏观', tagEn: 'Macro', impact: 'positive', titles: ['美联储维持利率不变', '非农数据超预期', '通胀持续降温', 'GDP增速上调', '消费信心回升'] },
  { tag: '科技', tagEn: 'Tech', impact: 'positive', titles: ['英伟达发布新架构', '苹果WWDC召开', 'AI芯片需求爆发', '微软云收入增长', '谷歌布局量子计算'] },
  { tag: '亚洲', tagEn: 'Asia', impact: 'warning', titles: ['日元汇率波动加剧', '恒指技术性回调', '中国经济数据公布', '韩股外资流出', '东南亚市场震荡'] },
  { tag: '突发', tagEn: 'Flash', impact: 'neutral', titles: ['半两分析师提示风险', '地缘政治影响市场', '大宗商品价格异动', '交易所技术故障', '财报季拉开帷幕'] },
];

const generateLargeNewsPool = (count: number) => {
  const pool = [];
  const startDate = new Date('2024-01-01');
  for (let i = 1; i <= count; i++) {
    const template = NEWS_TEMPLATES[i % NEWS_TEMPLATES.length];
    const titleIndex = i % template.titles.length;
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + Math.floor(i / 5));
    pool.push({
      id: i,
      tag: template.tag,
      tagEn: template.tagEn,
      title: `${template.titles[titleIndex]}${i > 200 ? '（更新）' : ''}`,
      titleEn: template.titles[titleIndex],
      body: '相关内容摘要，更多细节请点击查看。',
      bodyEn: 'Summary content, click for details.',
      impact: template.impact,
      source: ['路透社', '彭博社', 'CNBC', '半两研究院'][i % 4],
      sourceEn: ['Reuters', 'Bloomberg', 'CNBC', 'Banliang'][i % 4],
      date: date.toISOString().split('T')[0],
      dateEn: date.toISOString().split('T')[0],
      fullContent: `详细内容：${template.titles[titleIndex]}。这是一段模拟的新闻全文，展示更多信息。`,
      fullContentEn: `Full content: ${template.titles[titleIndex]}. This is simulated news content.`,
      imageUrl: `https://picsum.photos/id/${(i % 100) + 1}/400/200`,
    });
  }
  return pool;
};

const INITIAL_NEWS_POOL = generateLargeNewsPool(300); // 300条新闻

interface TradeRecord {
  id: string;
  symbol: string;
  direction: 'buy' | 'sell';
  price: number;
  quantity: number;
  total: number;
  timestamp: number;
  dateStr: string;
}

export default function Home() {
  const [lang, setLang] = useState<Language>('zh');
  const t = (key: keyof typeof translations.zh) => (translations[lang] as any)[key] || key;

  // 核心状态
  const [balance, setBalance] = useState(1000000); // 修改为100万美金
  const [shares, setShares] = useState<Record<string, number>>({});
  const [prices, setPrices] = useState(ASSETS);
  const [activeId, setActiveId] = useState('SPY');
  const [amt, setAmt] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [exp, setExp] = useState(0);
  const [unlockedFoods, setUnlockedFoods] = useState<typeof FOOD_COLLECTION>([]);
  const [currentProgress, setCurrentProgress] = useState(0);

  // 页面路由
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'payment'>('home');
  const [user, setUser] = useState<{ username: string; wechatBound: boolean } | null>(null);

  // 图表相关（不再使用 chartRange 动态更新数据）
  const [chartRange, setChartRange] = useState<'1m' | '10m' | '1h' | '1d' | '1mo' | '1y'>('1d');
  const activeAsset = useMemo(() => prices.find(p => p.id === activeId) || ASSETS[0], [prices, activeId]);

  // 静态K线数据生成（基于股票初始价格，固定不变）
  const generateStaticCandlestickData = (basePrice: number, points: number = 100) => {
    const data = [];
    let currentPrice = basePrice;
    for (let i = 0; i < points; i++) {
      const open = currentPrice;
      const change = (Math.random() - 0.5) * 0.015;
      const close = open * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.008);
      const low = Math.min(open, close) * (1 - Math.random() * 0.008);
      data.push({
        time: i + 1,
        open,
        high,
        low,
        close,
      });
      currentPrice = close;
    }
    return data;
  };

  const [staticChartData, setStaticChartData] = useState<any[]>([]);

  // 当切换股票时，重新生成静态K线数据
  useEffect(() => {
    const newData = generateStaticCandlestickData(activeAsset.price);
    setStaticChartData(newData);
  }, [activeAsset.id]); // 仅在股票id变化时更新

  const [searchTerm, setSearchTerm] = useState('');
  const filteredAssets = useMemo(() => {
    if (!searchTerm.trim()) return prices;
    const lower = searchTerm.toLowerCase();
    return prices.filter(a => a.id.toLowerCase().includes(lower) || a.name.toLowerCase().includes(lower));
  }, [prices, searchTerm]);

  // 新闻相关：使用动态状态以便添加每日更新
  const [allNews, setAllNews] = useState(INITIAL_NEWS_POOL);
  const [newsSearchTerm, setNewsSearchTerm] = useState('');
  const filteredNews = useMemo(() => {
    if (!newsSearchTerm.trim()) return allNews;
    const term = newsSearchTerm.toLowerCase();
    return allNews.filter(n => 
      (lang === 'zh' ? n.title : n.titleEn).toLowerCase().includes(term) ||
      (lang === 'zh' ? n.body : n.bodyEn).toLowerCase().includes(term)
    );
  }, [newsSearchTerm, lang, allNews]);

  // 分页加载
  const [newsPage, setNewsPage] = useState(1);
  const NEWS_PER_PAGE = 12;
  const paginatedNews = useMemo(() => {
    return filteredNews.slice(0, newsPage * NEWS_PER_PAGE);
  }, [filteredNews, newsPage]);

  // 滚动加载更多
  const loadMoreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && paginatedNews.length < filteredNews.length) {
          setNewsPage(prev => prev + 1);
        }
      },
      { threshold: 0.5 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [paginatedNews.length, filteredNews.length]);

  // 每日更新新闻（模拟）
  useEffect(() => {
    const addDailyNews = () => {
      const todayStr = new Date().toDateString();
      const lastUpdate = localStorage.getItem('lastNewsUpdate');
      if (lastUpdate !== todayStr) {
        const newNews = {
          id: Date.now(),
          tag: '最新',
          tagEn: 'Latest',
          title: `半两早报 ${new Date().toLocaleDateString()}`,
          titleEn: `Banliang Morning Brief ${new Date().toLocaleDateString()}`,
          body: '今日市场动态摘要：美联储官员讲话、科技股财报前瞻等。',
          bodyEn: "Today's market update: Fed speeches, tech earnings preview.",
          impact: 'neutral',
          source: '半两研究院',
          sourceEn: 'Banliang Research',
          date: new Date().toISOString().split('T')[0],
          dateEn: new Date().toISOString().split('T')[0],
          fullContent: '详细内容：半两研究院每日市场前瞻，包含重要经济数据、公司事件及技术分析。',
          fullContentEn: 'Full content: Banliang Research daily market preview, including key economic data, corporate events, and technical analysis.',
          imageUrl: `https://picsum.photos/id/20/400/200`,
        };
        setAllNews(prev => [newNews, ...prev]);
        localStorage.setItem('lastNewsUpdate', todayStr);
      }
    };
    addDailyNews();
  }, []);

  const [tradeHistory, setTradeHistory] = useState<TradeRecord[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);

  // K线图引用
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  // 定时更新价格（不影响图表）
  useEffect(() => {
    const timer = setInterval(() => {
      setPrices(prev => prev.map(a => ({
        ...a,
        price: parseFloat((a.price * (1 + Math.random() * 0.002 - 0.001)).toFixed(2))
      })));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const gainExp = (val: number) => {
    setExp(prev => prev + val);
    setCurrentProgress(prev => {
      let newProgress = prev + val;
      let unlockCount = 0;
      while (newProgress >= 100 && unlockCount < 5) {
        const randomFood = FOOD_COLLECTION[Math.floor(Math.random() * FOOD_COLLECTION.length)];
        setUnlockedFoods(prevFoods => [randomFood, ...prevFoods].slice(0, 12));
        newProgress -= 100;
        unlockCount++;
      }
      return newProgress;
    });
  };

  const trade = (type: 'buy' | 'sell') => {
    const n = parseFloat(amt);
    if (isNaN(n) || n <= 0) return;
    const total = n * activeAsset.price;

    if (type === 'buy') {
      if (balance >= total) {
        setBalance(b => b - total);
        setShares(s => ({ ...s, [activeAsset.id]: (s[activeAsset.id] || 0) + n }));
        gainExp(25);
        const record: TradeRecord = {
          id: Date.now().toString(),
          symbol: activeAsset.id,
          direction: 'buy',
          price: activeAsset.price,
          quantity: n,
          total: total,
          timestamp: Date.now(),
          dateStr: new Date().toLocaleString(),
        };
        setTradeHistory(prev => [record, ...prev]);
        setAmt('');
      } else {
        alert(t('insufficientFunds'));
      }
    } else {
      if ((shares[activeAsset.id] || 0) >= n) {
        setBalance(b => b + total);
        setShares(s => ({ ...s, [activeAsset.id]: s[activeAsset.id] - n }));
        gainExp(15);
        const record: TradeRecord = {
          id: Date.now().toString(),
          symbol: activeAsset.id,
          direction: 'sell',
          price: activeAsset.price,
          quantity: n,
          total: total,
          timestamp: Date.now(),
          dateStr: new Date().toLocaleString(),
        };
        setTradeHistory(prev => [record, ...prev]);
        setAmt('');
      } else {
        alert(t('insufficientShares'));
      }
    }
  };

  const totalEquity = Object.entries(shares).reduce((acc, [id, qty]) => {
    const price = prices.find(a => a.id === id)?.price || 0;
    return acc + (qty * price);
  }, 0);

  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<'americano' | 'cappuccino' | 'caramel'>('americano');
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay' | 'visa'>('wechat');
  const drinkPrices = { americano: 19.9, cappuccino: 39.9, caramel: 49.9 };
  const drinkNames = { americano: t('iceAmericano'), cappuccino: t('cappuccino'), caramel: t('caramelLatte') };

  const handlePayment = () => {
    if (!user) {
      alert('请先登录');
      setCurrentPage('login');
      return;
    }
    alert(t('paySuccess'));
    setShowPaymentModal(false);
  };

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', phone: '', password: '', confirm: '', wechat: '' });
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = () => {
    if (loginForm.username && loginForm.password) {
      setUser({ username: loginForm.username, wechatBound: false });
      setCurrentPage('home');
    } else {
      alert('请输入用户名和密码');
    }
  };

  const handleRegister = () => {
    if (registerForm.password !== registerForm.confirm) {
      alert('密码不一致');
      return;
    }
    setUser({ username: registerForm.username, wechatBound: !!registerForm.wechat });
    setCurrentPage('home');
  };

  // 获取当前等级名称
  const getCurrentLevel = (exp: number, lang: Language) => {
    const level = LEVELS.filter(l => l.threshold <= exp).slice(-1)[0];
    return lang === 'zh' ? level.zh : level.en;
  };

  // -------------------- K线图初始化 --------------------
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: isDark ? '#1E2A1E' : '#F9F7F2' },
        textColor: isDark ? '#E8E3D9' : '#3A2C1F',
      },
      grid: {
        vertLines: { color: isDark ? '#2C3A2C' : '#E8E3D9' },
        horzLines: { color: isDark ? '#2C3A2C' : '#E8E3D9' },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: isDark ? '#2C3A2C' : '#E8E3D9' },
      timeScale: { borderColor: isDark ? '#2C3A2C' : '#E8E3D9', timeVisible: true, secondsVisible: false },
    });
    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [isDark]);

  // 更新图表数据（使用静态数据）
  useEffect(() => {
    if (seriesRef.current && staticChartData.length) {
      const formattedData = staticChartData.map((item, idx) => ({
        time: idx + 1,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));
      seriesRef.current.setData(formattedData);
      chartRef.current?.timeScale().fitContent();
    }
  }, [staticChartData]);

  // -------------------- 渲染函数 --------------------
  const renderLoginPage = () => (
    <div className="flex items-center justify-center min-h-screen bg-[#F9F7F2] dark:bg-[#1E2A1E]">
      <div className="w-full max-w-md p-8 bg-white/90 dark:bg-[#2C3A2C] rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? t('login') : t('register')}</h2>
        {isLogin ? (
          <>
            <input
              type="text"
              placeholder={t('username')}
              className="w-full p-3 mb-4 border rounded-lg dark:bg-[#3A4A3A] dark:border-[#4A5A4A]"
              value={loginForm.username}
              onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
            />
            <input
              type="password"
              placeholder={t('password')}
              className="w-full p-3 mb-6 border rounded-lg dark:bg-[#3A4A3A] dark:border-[#4A5A4A]"
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            <button onClick={handleLogin} className="w-full py-3 bg-[#8BAA6E] text-white rounded-lg font-bold">{t('loginBtn')}</button>
            <p className="text-center mt-4 text-sm">没有账号？ <button onClick={() => setIsLogin(false)} className="text-[#8BAA6E] underline">注册</button></p>
          </>
        ) : (
          <>
            <input type="text" placeholder={t('username')} className="w-full p-3 mb-4 border rounded-lg" value={registerForm.username} onChange={e => setRegisterForm({ ...registerForm, username: e.target.value })} />
            <input type="email" placeholder={t('email')} className="w-full p-3 mb-4 border rounded-lg" value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} />
            <input type="tel" placeholder={t('phone')} className="w-full p-3 mb-4 border rounded-lg" value={registerForm.phone} onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })} />
            <input type="password" placeholder={t('password')} className="w-full p-3 mb-4 border rounded-lg" value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} />
            <input type="password" placeholder={t('confirmPassword')} className="w-full p-3 mb-4 border rounded-lg" value={registerForm.confirm} onChange={e => setRegisterForm({ ...registerForm, confirm: e.target.value })} />
            <div className="flex items-center mb-4">
              <span className="mr-2">{t('bindWechat')}</span>
              <input type="text" placeholder={t('wechatPlaceholder')} className="flex-1 p-3 border rounded-lg" value={registerForm.wechat} onChange={e => setRegisterForm({ ...registerForm, wechat: e.target.value })} />
            </div>
            <button onClick={handleRegister} className="w-full py-3 bg-[#8BAA6E] text-white rounded-lg font-bold">{t('registerBtn')}</button>
            <p className="text-center mt-4 text-sm">已有账号？ <button onClick={() => setIsLogin(true)} className="text-[#8BAA6E] underline">登录</button></p>
          </>
        )}
      </div>
    </div>
  );

  const renderPaymentPage = () => (
    <div className="flex items-center justify-center min-h-screen bg-[#F9F7F2] dark:bg-[#1E2A1E]">
      <div className="w-full max-w-md p-8 bg-white/90 dark:bg-[#2C3A2C] rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">{t('selectDrink')}</h2>
        <div className="space-y-4 mb-6">
          {Object.entries(drinkNames).map(([key, name]) => (
            <label key={key} className="flex items-center p-3 border rounded-lg cursor-pointer">
              <input type="radio" name="drink" value={key} checked={selectedDrink === key} onChange={() => setSelectedDrink(key as any)} className="mr-3" />
              <span className="flex-1">{name}</span>
              <span>¥{drinkPrices[key as keyof typeof drinkPrices]}</span>
            </label>
          ))}
        </div>
        <div className="mb-6">
          <p className="font-bold mb-2">{t('paymentMethod')}</p>
          <div className="flex gap-4">
            <button onClick={() => setPaymentMethod('wechat')} className={`flex-1 py-2 rounded-lg border ${paymentMethod === 'wechat' ? 'border-[#8BAA6E] bg-[#8BAA6E]/10' : ''}`}>微信</button>
            <button onClick={() => setPaymentMethod('alipay')} className={`flex-1 py-2 rounded-lg border ${paymentMethod === 'alipay' ? 'border-[#8BAA6E] bg-[#8BAA6E]/10' : ''}`}>支付宝</button>
            <button onClick={() => setPaymentMethod('visa')} className={`flex-1 py-2 rounded-lg border ${paymentMethod === 'visa' ? 'border-[#8BAA6E] bg-[#8BAA6E]/10' : ''}`}>Visa</button>
          </div>
        </div>
        <button onClick={handlePayment} className="w-full py-3 bg-[#8BAA6E] text-white rounded-lg font-bold">{t('pay')}</button>
        <button onClick={() => setCurrentPage('home')} className="w-full mt-3 py-2 text-gray-500 underline">返回</button>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className={`flex flex-col h-screen ${isDark ? 'bg-[#1E2A1E] text-[#E8E3D9]' : 'bg-[#F9F7F2] text-[#3A2C1F]'}`}>
      <header className={`h-20 flex items-center justify-between px-8 border-b ${isDark ? 'border-[#2C3A2C]' : 'border-[#E8E3D9]'} bg-opacity-80 backdrop-blur-xl sticky top-0 z-10`}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#8BAA6E] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-serif text-xl">半</span>
          </div>
          <h1 className="font-black text-xl tracking-tighter hidden md:block">BANLIANG GLOBAL</h1>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setLang('zh')} className={`px-2 py-1 rounded ${lang === 'zh' ? 'bg-[#8BAA6E] text-white' : ''}`}>中文</button>
          <button onClick={() => setLang('en')} className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-[#8BAA6E] text-white' : ''}`}>EN</button>
          <button onClick={() => setShowHistoryModal(true)} className="px-3 py-1 rounded text-sm bg-[#8BAA6E]/20 hover:bg-[#8BAA6E]/40 transition">
            📊 {t('tradeHistory')}
          </button>
        </div>

        <div className={`flex items-center gap-4 px-5 py-2 rounded-2xl ${isDark ? 'bg-[#2C3A2C]' : 'bg-[#E8E3D9]'}`}>
          <div className="text-right mr-2">
            <p className="text-[10px] font-black opacity-60 uppercase">{t('nextReward')}</p>
            <p className="text-xs font-bold text-[#8BAA6E]">{t('snackIncubating')}</p>
          </div>
          <div className="w-24 h-3 bg-[#D9D0C0] dark:bg-[#4A5A4A] rounded-full overflow-hidden">
            <div className="h-full bg-[#8BAA6E] transition-all duration-700" style={{ width: `${currentProgress}%` }} />
          </div>
          <span className="text-xl">{currentProgress > 80 ? '🎁' : '🥣'}</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] opacity-60 font-bold uppercase">{t('netWorth')}</p>
            <p className="font-mono font-bold text-lg text-[#8BAA6E]">${(balance + totalEquity).toLocaleString()}</p>
          </div>
          <button onClick={() => setIsDark(!isDark)} className="text-xl opacity-60 hover:opacity-100 transition">
            {isDark ? '☀️' : '🌙'}
          </button>
          {user && (
            <button onClick={() => setCurrentPage('login')} className="text-sm px-3 py-1 rounded-full bg-[#8BAA6E]/20">
              {user.username}
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 左侧市场 */}
        <aside className={`w-64 border-r ${isDark ? 'border-[#2C3A2C]' : 'border-[#E8E3D9]'} p-4 overflow-y-auto`}>
          <div className="mb-4">
            <input
              type="text"
              placeholder={t('searchStock')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8BAA6E]"
            />
          </div>
          <p className="text-[10px] font-black opacity-40 tracking-[0.2em] mb-4 uppercase">{t('liveMarket')}</p>
          {filteredAssets.map(a => (
            <div
              key={a.id}
              onClick={() => setActiveId(a.id)}
              className={`p-3 rounded-[20px] mb-2 cursor-pointer transition-all ${activeId === a.id ? 'bg-[#8BAA6E] text-white shadow-xl translate-x-1' : `bg-[#E8E3D9] dark:bg-[#2C3A2C] hover:bg-[#D9D0C0]`}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm">{a.id}</span>
                <span className="w-2 h-2 rounded-full bg-white/50" />
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] opacity-70">{a.name}</span>
                <span className="font-mono text-xs">${a.price.toLocaleString()}</span>
              </div>
            </div>
          ))}
          <div className="mt-8 p-5 rounded-[32px] bg-[#E8E3D9] dark:bg-[#2C3A2C] cursor-pointer" onClick={() => setShowPaymentModal(true)}>
            <div className="text-2xl mb-2">🍵</div>
            <p className="text-sm font-black">{t('buyTea')}</p>
            <p className="text-[10px] opacity-60 mt-1">{t('supportDesc')}</p>
            <button className="mt-3 text-[10px] font-bold px-3 py-1 rounded-full bg-white/60">{t('treat')}</button>
          </div>
        </aside>

        {/* 中间主区 */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-sm opacity-60 uppercase">{activeAsset.zone} · {activeAsset.name}</p>
                <h2 className="text-5xl font-extralight">${activeAsset.price.toLocaleString()}</h2>
              </div>
              <div className="text-right pb-2">
                <span className="text-xs bg-[#8BAA6E]/10 text-[#8BAA6E] px-3 py-1 rounded-full">● LIVE</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                <h3 className="font-bold">{t('priceChart')}</h3>
                <div className="flex gap-2 text-xs">
                  {(['1m', '10m', '1h', '1d', '1mo', '1y'] as const).map(range => (
                    <button
                      key={range}
                      onClick={() => setChartRange(range)}
                      className={`px-2 py-1 rounded ${chartRange === range ? 'bg-[#8BAA6E] text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                      {t(range)}
                    </button>
                  ))}
                </div>
              </div>
              <div ref={chartContainerRef} style={{ width: '100%', height: 300 }} />
              <p className="text-xs text-center text-gray-400 mt-2">提示：鼠标滚轮缩放，拖拽查看历史K线</p>
            </div>

            <div className={`p-6 rounded-[40px] border shadow-xl mb-6 ${isDark ? 'bg-[#2C3A2C] border-[#4A5A4A]' : 'bg-white/90 border-[#E8E3D9]'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] text-gray-400 font-black uppercase">{t('quantity')}</label>
                  <input
                    type="number"
                    value={amt}
                    onChange={e => setAmt(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-3xl font-light bg-transparent border-b border-[#8BAA6E]/30 focus:border-[#8BAA6E] outline-none pb-2"
                  />
                  <p className="mt-2 text-xs text-gray-400">{t('estimated')} ${((parseFloat(amt) || 0) * activeAsset.price).toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => trade('buy')} className="w-full py-3 bg-[#8BAA6E] hover:bg-[#6F8E52] text-white rounded-2xl font-bold text-lg shadow-lg active:scale-95">{t('buy')}</button>
                  <button onClick={() => trade('sell')} className={`w-full py-3 border-2 rounded-2xl font-bold ${isDark ? 'border-[#4A5A4A]' : 'border-[#E8E3D9]'}`}>{t('sell')}</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-3xl border ${isDark ? 'bg-[#2C3A2C]' : 'bg-white/90'}`}>
                <p className="text-[10px] text-gray-400">{t('cash')}</p>
                <p className="font-mono text-xl">${balance.toLocaleString()}</p>
              </div>
              <div className={`p-4 rounded-3xl border ${isDark ? 'bg-[#2C3A2C]' : 'bg-white/90'}`}>
                <p className="text-[10px] text-gray-400">{t('equity')}</p>
                <p className="font-mono text-xl text-[#8BAA6E]">${totalEquity.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-3xl border bg-[#8BAA6E]/10 cursor-pointer" onClick={() => setShowLevelModal(true)}>
                <p className="text-[10px] text-[#8BAA6E]">{t('level')}</p>
                <p className="font-mono text-xl font-bold">{getCurrentLevel(exp, lang)}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[10px] text-gray-400 font-black mb-3 uppercase text-center">{t('portfolio')}</p>
              <div className="flex h-2 w-full rounded-full overflow-hidden bg-[#E8E3D9] dark:bg-[#2C3A2C]">
                {prices.map(a => {
                  const qty = shares[a.id] || 0;
                  const weight = totalEquity > 0 ? (qty * a.price) / totalEquity * 100 : 0;
                  return <div key={a.id} className={`h-full ${a.color}`} style={{ width: `${weight}%` }} title={`${a.id}: ${weight.toFixed(1)}%`} />;
                })}
              </div>
              {totalEquity === 0 && <p className="text-[10px] text-center mt-2 opacity-40">{t('noPosition')}</p>}
            </div>

            {unlockedFoods.length > 0 && (
              <div className="mt-8">
                <p className="text-[10px] text-gray-400 font-black mb-3 uppercase text-center">{t('foodGallery')}</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {unlockedFoods.slice(0, 8).map((food, idx) => (
                    <div key={idx} className={`w-16 h-16 rounded-2xl ${food.color} flex flex-col items-center justify-center shadow-sm`} title={food.desc}>
                      <span className="text-2xl">{food.icon}</span>
                      <span className="text-[8px] font-bold mt-1">{food.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* 右侧情报 */}
        <aside className={`w-72 border-l ${isDark ? 'border-[#2C3A2C]' : 'border-[#E8E3D9]'} p-4 overflow-y-auto`}>
          <div className="mb-4">
            <input
              type="text"
              placeholder={t('searchNews')}
              value={newsSearchTerm}
              onChange={(e) => setNewsSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8BAA6E]"
            />
          </div>
          <p className="text-[10px] font-black opacity-40 uppercase mb-4">{t('intelligence')}</p>
          <div className="space-y-4">
            {paginatedNews.map(n => (
              <div
                key={n.id}
                onClick={() => setSelectedNews(n)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${isDark ? 'bg-[#2C3A2C] border-[#4A5A4A] hover:bg-[#3A4A3A]' : 'bg-white/90 border-[#E8E3D9] hover:bg-white'}`}
              >
                {n.imageUrl && (
                  <img
                    src={n.imageUrl}
                    alt="news"
                    className="w-full h-28 object-cover rounded-lg mb-3"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                )}
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${n.impact === 'positive' ? 'bg-[#8BAA6E]/20 text-[#8BAA6E]' : n.impact === 'warning' ? 'bg-red-500/20 text-red-500' : 'bg-gray-400/20 text-gray-500'}`}>
                    {lang === 'zh' ? n.tag : n.tagEn}
                  </span>
                  <span className="text-[9px] opacity-50">{lang === 'zh' ? n.tag : n.tagEn}</span>
                </div>
                <h4 className="text-sm font-bold mt-1 line-clamp-2">{lang === 'zh' ? n.title : n.titleEn}</h4>
                <p className="text-xs opacity-70 mt-1 line-clamp-2">{lang === 'zh' ? n.body : n.bodyEn}</p>
              </div>
            ))}
            {/* 加载更多触发器 */}
            <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
              {paginatedNews.length < filteredNews.length && (
                <span className="text-xs text-gray-400">加载更多...</span>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* 等级模态框 */}
      {showLevelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLevelModal(false)}>
          <div className="bg-white dark:bg-[#2C3A2C] rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{t('levelTitle')}</h2>
            <div className="space-y-4">
              {LEVELS.map((level, idx) => {
                const isCurrent = exp >= level.threshold && (idx === LEVELS.length - 1 || exp < LEVELS[idx + 1].threshold);
                const isLocked = exp < level.threshold;
                return (
                  <div key={idx} className={`p-4 rounded-xl border ${isCurrent ? 'bg-[#8BAA6E]/20 border-[#8BAA6E]' : isLocked ? 'opacity-40' : ''}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold">{lang === 'zh' ? level.zh : level.en}</h3>
                      <span className="text-xs text-gray-500">{level.threshold} {t('expRequired')}</span>
                    </div>
                    <p className="text-xs mt-1">{lang === 'zh' ? `达到 ${level.threshold} 经验解锁` : `Reach ${level.threshold} EXP to unlock`}</p>
                    {isCurrent && <p className="text-xs text-[#8BAA6E] mt-2">{t('currentLevel')}</p>}
                    {!isCurrent && !isLocked && idx < LEVELS.length - 1 && (
                      <p className="text-xs mt-2">{t('nextLevelExp')} {LEVELS[idx + 1].threshold - exp} {t('expRequired')}</p>
                    )}
                  </div>
                );
              })}
            </div>
            <button onClick={() => setShowLevelModal(false)} className="mt-6 w-full py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">关闭</button>
          </div>
        </div>
      )}

      {/* 支付模态框 */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white dark:bg-[#2C3A2C] rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{t('selectDrink')}</h2>
            <div className="space-y-4 mb-6">
              {Object.entries(drinkNames).map(([key, name]) => (
                <label key={key} className="flex items-center p-3 border rounded-lg cursor-pointer">
                  <input type="radio" name="drink" value={key} checked={selectedDrink === key} onChange={() => setSelectedDrink(key as any)} className="mr-3" />
                  <span className="flex-1">{name}</span>
                  <span>¥{drinkPrices[key as keyof typeof drinkPrices]}</span>
                </label>
              ))}
            </div>
            <div className="mb-6">
              <p className="font-bold mb-2">{t('paymentMethod')}</p>
              <div className="flex gap-4">
                <button onClick={() => setPaymentMethod('wechat')} className={`flex-1 py-2 rounded-lg border ${paymentMethod === 'wechat' ? 'border-[#8BAA6E] bg-[#8BAA6E]/10' : ''}`}>微信</button>
                <button onClick={() => setPaymentMethod('alipay')} className={`flex-1 py-2 rounded-lg border ${paymentMethod === 'alipay' ? 'border-[#8BAA6E] bg-[#8BAA6E]/10' : ''}`}>支付宝</button>
                <button onClick={() => setPaymentMethod('visa')} className={`flex-1 py-2 rounded-lg border ${paymentMethod === 'visa' ? 'border-[#8BAA6E] bg-[#8BAA6E]/10' : ''}`}>Visa</button>
              </div>
            </div>
            <button onClick={handlePayment} className="w-full py-3 bg-[#8BAA6E] text-white rounded-lg font-bold">{t('pay')}</button>
            <button onClick={() => setShowPaymentModal(false)} className="w-full mt-3 py-2 text-gray-500 underline">取消</button>
          </div>
        </div>
      )}

      {/* 交易历史模态框 */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowHistoryModal(false)}>
          <div className="bg-white dark:bg-[#2C3A2C] rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{t('tradeHistory')}</h2>
            {tradeHistory.length === 0 ? (
              <p className="text-center text-gray-500">{t('noHistory')}</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2">{t('time')}</th>
                    <th className="text-left">{t('symbol')}</th>
                    <th className="text-left">{t('direction')}</th>
                    <th className="text-left">{t('priceUnit')}</th>
                    <th className="text-left">{t('qtyUnit')}</th>
                    <th className="text-left">{t('totalAmount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeHistory.map(record => (
                    <tr key={record.id} className="border-b last:border-0">
                      <td className="py-2">{record.dateStr}</td>
                      <td>{record.symbol}</td>
                      <td className={record.direction === 'buy' ? 'text-green-600' : 'text-red-600'}>
                        {t(record.direction === 'buy' ? 'buyDirection' : 'sellDirection')}
                      </td>
                      <td>${record.price.toFixed(2)}</td>
                      <td>{record.quantity}</td>
                      <td>${record.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button onClick={() => setShowHistoryModal(false)} className="mt-6 w-full py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">关闭</button>
          </div>
        </div>
      )}

      {/* 新闻详情模态框 */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedNews(null)}>
          <div className="bg-white dark:bg-[#2C3A2C] rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-2">{lang === 'zh' ? selectedNews.title : selectedNews.titleEn}</h2>
            <div className="flex gap-4 text-xs text-gray-500 mb-4">
              <span>{lang === 'zh' ? selectedNews.source : selectedNews.sourceEn}</span>
              <span>{lang === 'zh' ? selectedNews.date : selectedNews.dateEn}</span>
            </div>
            {selectedNews.imageUrl && (
              <img src={selectedNews.imageUrl} alt="" className="w-full h-48 object-cover rounded-lg mb-4" />
            )}
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {lang === 'zh' ? selectedNews.fullContent : selectedNews.fullContentEn}
            </p>
            <button onClick={() => setSelectedNews(null)} className="mt-6 w-full py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">{t('backToList')}</button>
          </div>
        </div>
      )}
    </div>
  );

  // 根据 currentPage 渲染不同页面
  if (currentPage === 'login') return renderLoginPage();
  if (currentPage === 'payment') return renderPaymentPage();
  return renderHome();
}