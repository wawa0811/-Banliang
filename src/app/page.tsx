'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createChart, CrosshairMode, CandlestickSeries } from 'lightweight-charts';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';

// -------------------- Multi-language Config --------------------
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
    priceChart: '价格走势',
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
    priceChart: 'Price Chart',
    '1m': '1m',
    '10m': '10m',
    '1h': '1h',
    '1d': '1d',
    '1mo': '1mo',
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

// -------------------- Asset Data --------------------
const ASSETS = [
  { id: 'SPY', name: 'S&P 500', zone: 'NA', price: 512.45, color: 'bg-primary' },
  { id: 'QQQ', name: 'Nasdaq 100', zone: 'NA', price: 445.2, color: 'bg-primary' },
  { id: 'AAPL', name: 'Apple Inc.', zone: 'NA', price: 175.30, color: 'bg-primary' },
  { id: 'MSFT', name: 'Microsoft', zone: 'NA', price: 420.80, color: 'bg-primary' },
  { id: 'GOOGL', name: 'Alphabet', zone: 'NA', price: 150.25, color: 'bg-primary' },
  { id: 'TSLA', name: 'Tesla', zone: 'NA', price: 175.60, color: 'bg-primary' },
  { id: 'HSI', name: 'Hang Seng', zone: 'ASIA', price: 16500, color: 'bg-danger' },
  { id: 'N225', name: 'Nikkei 225', zone: 'ASIA', price: 38500, color: 'bg-danger' },
  { id: 'SSE', name: 'Shanghai Comp', zone: 'ASIA', price: 3100, color: 'bg-danger' },
  { id: 'DAX', name: 'DAX', zone: 'EU', price: 17850, color: 'bg-success' },
  { id: 'UKX', name: 'FTSE 100', zone: 'EU', price: 7900, color: 'bg-success' },
  { id: 'CAC', name: 'CAC 40', zone: 'EU', price: 7600, color: 'bg-success' },
  { id: 'BABA', name: 'Alibaba', zone: 'ASIA', price: 75.40, color: 'bg-danger' },
  { id: 'NVDA', name: 'NVIDIA', zone: 'NA', price: 900.10, color: 'bg-primary' },
  { id: 'AMD', name: 'AMD', zone: 'NA', price: 150.20, color: 'bg-primary' },
];

const FOOD_COLLECTION = [
  { icon: '01', name: 'Matcha', desc: 'Stay calm to see through the red and green', color: 'bg-secondary' },
  { icon: '02', name: 'Grape', desc: 'Harvest time, hold for luck', color: 'bg-secondary' },
  { icon: '03', name: 'Croissant', desc: 'Crispy outside, profit inside', color: 'bg-secondary' },
  { icon: '04', name: 'Berry', desc: 'Sweet returns, sweet life', color: 'bg-secondary' },
  { icon: '05', name: 'Avocado', desc: 'Healthy position, long term gold', color: 'bg-secondary' },
  { icon: '06', name: 'Layer Cake', desc: 'Light profits, no anxiety', color: 'bg-secondary' }
];

const LEVELS = [
  { threshold: 0, zh: '韭菜萌新', en: 'Sprout' },
  { threshold: 100, zh: '短线快手', en: 'Quick Hand' },
  { threshold: 500, zh: '华尔街学徒', en: 'Apprentice' },
  { threshold: 1000, zh: '半两大空头', en: 'Legendary' },
];

// -------------------- News Data --------------------
const NEWS_TEMPLATES = [
  { tag: '宏观', tagEn: 'Macro', impact: 'positive', titles: ['Fed Holds Rates Steady', 'Non-Farm Data Beats', 'Inflation Cools', 'GDP Revised Up', 'Consumer Confidence Rises'] },
  { tag: '科技', tagEn: 'Tech', impact: 'positive', titles: ['NVIDIA New Architecture', 'Apple WWDC', 'AI Chip Demand Surges', 'Microsoft Cloud Growth', 'Google Quantum Push'] },
  { tag: '亚洲', tagEn: 'Asia', impact: 'warning', titles: ['Yen Volatility Spikes', 'HSI Technical Pullback', 'China Data Release', 'Korean Outflows', 'SEA Markets Choppy'] },
  { tag: '突发', tagEn: 'Flash', impact: 'neutral', titles: ['Analyst Risk Alert', 'Geopolitical Impact', 'Commodity Price Move', 'Exchange Tech Issue', 'Earnings Season Begins'] },
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
      title: `${template.titles[titleIndex]}${i > 200 ? ' (Updated)' : ''}`,
      titleEn: template.titles[titleIndex],
      body: 'Related content summary, click for more details.',
      bodyEn: 'Summary content, click for details.',
      impact: template.impact,
      source: ['Reuters', 'Bloomberg', 'CNBC', 'Banliang'][i % 4],
      sourceEn: ['Reuters', 'Bloomberg', 'CNBC', 'Banliang'][i % 4],
      date: date.toISOString().split('T')[0],
      dateEn: date.toISOString().split('T')[0],
      fullContent: `Full content: ${template.titles[titleIndex]}. This is simulated detailed news content.`,
      fullContentEn: `Full content: ${template.titles[titleIndex]}. This is simulated news content.`,
      imageUrl: `https://picsum.photos/id/${(i % 100) + 1}/400/200`,
    });
  }
  return pool;
};

const INITIAL_NEWS_POOL = generateLargeNewsPool(300);

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

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const letterAnimation = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.03,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
};

// Animated Text Component
function AnimatedText({ text, className }: { text: string; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterAnimation}
          className="inline-block"
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Magnetic Button Component
function MagneticButton({ 
  children, 
  onClick, 
  className = '',
  variant = 'primary'
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = "relative overflow-hidden font-medium tracking-wide uppercase text-xs";
  const variantStyles = {
    primary: "bg-primary text-primary-foreground px-8 py-4",
    secondary: "bg-secondary text-secondary-foreground px-6 py-3",
    outline: "border border-border px-6 py-3 hover:bg-primary hover:text-primary-foreground hover:border-primary"
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.span
        className="absolute inset-0 bg-accent"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ transformOrigin: 'left' }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// Hover Reveal Image Component
function HoverRevealItem({ 
  children, 
  imageUrl, 
  onClick,
  isActive
}: { 
  children: React.ReactNode; 
  imageUrl?: string;
  onClick?: () => void;
  isActive?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative cursor-pointer py-4 border-b border-border group ${isActive ? 'bg-secondary' : ''}`}
      whileHover={{ x: 20 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
      
      <AnimatePresence>
        {isHovered && imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed pointer-events-none z-50 w-64 h-40 overflow-hidden"
            style={{ 
              left: mousePosition.x + 20, 
              top: mousePosition.y - 80,
            }}
          >
            <img 
              src={imageUrl} 
              alt="" 
              className="w-full h-full object-cover grayscale"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Language>('en');
  const t = (key: keyof typeof translations.zh) => (translations[lang] as Record<string, string>)[key] || key;

  // Core State
  const [balance, setBalance] = useState(1000000);
  const [shares, setShares] = useState<Record<string, number>>({});
  const [prices, setPrices] = useState(ASSETS);
  const [activeId, setActiveId] = useState('SPY');
  const [amt, setAmt] = useState('');
  const [exp, setExp] = useState(0);
  const [unlockedFoods, setUnlockedFoods] = useState<typeof FOOD_COLLECTION>([]);
  const [currentProgress, setCurrentProgress] = useState(0);

  // Page Routing
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'payment'>('home');
  const [user, setUser] = useState<{ username: string; wechatBound: boolean } | null>(null);

  // Chart Related
  const [chartRange, setChartRange] = useState<'1m' | '10m' | '1h' | '1d' | '1mo' | '1y'>('1d');
  const activeAsset = useMemo(() => prices.find(p => p.id === activeId) || ASSETS[0], [prices, activeId]);

  // Static Candlestick Data
  const generateStaticCandlestickData = (basePrice: number, points: number = 100) => {
    const data = [];
    let currentPrice = basePrice;
    for (let i = 0; i < points; i++) {
      const open = currentPrice;
      const change = (Math.random() - 0.5) * 0.015;
      const close = open * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.008);
      const low = Math.min(open, close) * (1 - Math.random() * 0.008);
      data.push({ time: i + 1, open, high, low, close });
      currentPrice = close;
    }
    return data;
  };

  const [staticChartData, setStaticChartData] = useState<ReturnType<typeof generateStaticCandlestickData>>([]);

  useEffect(() => {
    const newData = generateStaticCandlestickData(activeAsset.price);
    setStaticChartData(newData);
  }, [activeAsset.id]);

  const [searchTerm, setSearchTerm] = useState('');
  const filteredAssets = useMemo(() => {
    if (!searchTerm.trim()) return prices;
    const lower = searchTerm.toLowerCase();
    return prices.filter(a => a.id.toLowerCase().includes(lower) || a.name.toLowerCase().includes(lower));
  }, [prices, searchTerm]);

  // News Related
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

  // Pagination
  const [newsPage, setNewsPage] = useState(1);
  const NEWS_PER_PAGE = 8;
  const paginatedNews = useMemo(() => {
    return filteredNews.slice(0, newsPage * NEWS_PER_PAGE);
  }, [filteredNews, newsPage]);

  // Scroll Load More
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

  const [tradeHistory, setTradeHistory] = useState<TradeRecord[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<typeof INITIAL_NEWS_POOL[0] | null>(null);

  // Chart Refs
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRef = useRef<ReturnType<ReturnType<typeof createChart>['addSeries']> | null>(null);

  // Price Updates
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
      alert('Please login first');
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
      alert('Please enter username and password');
    }
  };

  const handleRegister = () => {
    if (registerForm.password !== registerForm.confirm) {
      alert('Passwords do not match');
      return;
    }
    setUser({ username: registerForm.username, wechatBound: !!registerForm.wechat });
    setCurrentPage('home');
  };

  const getCurrentLevel = (exp: number, lang: Language) => {
    const level = LEVELS.filter(l => l.threshold <= exp).slice(-1)[0];
    return lang === 'zh' ? level.zh : level.en;
  };

  // Chart Initialization
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 350,
      layout: {
        background: { color: '#0a0a0a' },
        textColor: '#a1a1aa',
      },
      grid: {
        vertLines: { color: '#27272a' },
        horzLines: { color: '#27272a' },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: '#27272a' },
      timeScale: { borderColor: '#27272a', timeVisible: true, secondsVisible: false },
    });
    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
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
  }, []);

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

  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  // Login Page
  const renderLoginPage = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen bg-background"
    >
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-md p-12 border border-border"
      >
        <motion.h2 
          className="text-4xl font-light tracking-tight text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isLogin ? t('login') : t('register')}
        </motion.h2>
        
        {isLogin ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <input
              type="text"
              placeholder={t('username')}
              className="w-full p-4 mb-6 bg-transparent border-b border-border focus:border-primary outline-none transition-colors text-foreground placeholder:text-muted-foreground"
              value={loginForm.username}
              onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
            />
            <input
              type="password"
              placeholder={t('password')}
              className="w-full p-4 mb-10 bg-transparent border-b border-border focus:border-primary outline-none transition-colors text-foreground placeholder:text-muted-foreground"
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            <MagneticButton onClick={handleLogin} className="w-full">
              {t('loginBtn')}
            </MagneticButton>
            <p className="text-center mt-8 text-sm text-muted-foreground">
              {"Don't have an account?"}{' '}
              <button onClick={() => setIsLogin(false)} className="text-primary underline underline-offset-4 hover:text-accent transition-colors">
                {t('register')}
              </button>
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <input type="text" placeholder={t('username')} className="w-full p-4 bg-transparent border-b border-border focus:border-primary outline-none transition-colors" value={registerForm.username} onChange={e => setRegisterForm({ ...registerForm, username: e.target.value })} />
            <input type="email" placeholder={t('email')} className="w-full p-4 bg-transparent border-b border-border focus:border-primary outline-none transition-colors" value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} />
            <input type="tel" placeholder={t('phone')} className="w-full p-4 bg-transparent border-b border-border focus:border-primary outline-none transition-colors" value={registerForm.phone} onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })} />
            <input type="password" placeholder={t('password')} className="w-full p-4 bg-transparent border-b border-border focus:border-primary outline-none transition-colors" value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} />
            <input type="password" placeholder={t('confirmPassword')} className="w-full p-4 bg-transparent border-b border-border focus:border-primary outline-none transition-colors" value={registerForm.confirm} onChange={e => setRegisterForm({ ...registerForm, confirm: e.target.value })} />
            <div className="pt-6">
              <MagneticButton onClick={handleRegister} className="w-full">
                {t('registerBtn')}
              </MagneticButton>
            </div>
            <p className="text-center pt-4 text-sm text-muted-foreground">
              Already have an account?{' '}
              <button onClick={() => setIsLogin(true)} className="text-primary underline underline-offset-4">
                {t('login')}
              </button>
            </p>
          </motion.div>
        )}
        
        <motion.button
          onClick={() => setCurrentPage('home')}
          className="w-full mt-6 py-3 text-muted-foreground text-sm hover:text-foreground transition-colors"
          whileHover={{ x: -5 }}
        >
          &larr; Back to Trading
        </motion.button>
      </motion.div>
    </motion.div>
  );

  // Home Page
  const renderHome = () => (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <motion.header 
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 border-b border-border bg-background/80 backdrop-blur-xl z-50"
      >
        <motion.div 
          className="flex items-center gap-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-10 h-10 bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-mono text-sm">BL</span>
          </div>
          <h1 className="font-light text-lg tracking-[0.3em] uppercase hidden md:block">Banliang</h1>
        </motion.div>

        <motion.div 
          className="flex items-center gap-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-1 text-xs tracking-wider">
            <button 
              onClick={() => setLang('zh')} 
              className={`px-3 py-2 transition-colors ${lang === 'zh' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              ZH
            </button>
            <span className="text-border">/</span>
            <button 
              onClick={() => setLang('en')} 
              className={`px-3 py-2 transition-colors ${lang === 'en' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              EN
            </button>
          </div>
          
          <button 
            onClick={() => setShowHistoryModal(true)} 
            className="text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors uppercase"
          >
            History
          </button>

          <div className="text-right">
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{t('netWorth')}</p>
            <motion.p 
              className="font-mono text-lg"
              key={balance + totalEquity}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ${(balance + totalEquity).toLocaleString()}
            </motion.p>
          </div>

          {user ? (
            <button 
              onClick={() => setCurrentPage('login')} 
              className="text-xs px-4 py-2 border border-border hover:bg-secondary transition-colors"
            >
              {user.username}
            </button>
          ) : (
            <MagneticButton onClick={() => setCurrentPage('login')} variant="outline">
              Login
            </MagneticButton>
          )}
        </motion.div>
      </motion.header>

      {/* Main Content */}
      <div className="flex flex-1 pt-20">
        {/* Left Sidebar - Market */}
        <motion.aside 
          className="w-80 border-r border-border p-6 overflow-y-auto fixed left-0 top-20 bottom-0 bg-background"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <input
              type="text"
              placeholder={t('searchStock')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-transparent border-b border-border focus:border-primary outline-none transition-colors placeholder:text-muted-foreground"
            />
          </motion.div>
          
          <motion.p 
            variants={fadeInUp}
            className="text-[10px] tracking-[0.3em] text-muted-foreground mb-6 uppercase"
          >
            {t('liveMarket')}
          </motion.p>
          
          <motion.div variants={staggerContainer}>
            {filteredAssets.map((a, index) => (
              <HoverRevealItem
                key={a.id}
                onClick={() => setActiveId(a.id)}
                isActive={activeId === a.id}
                imageUrl={`https://picsum.photos/id/${index + 10}/400/300`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-mono text-sm">{a.id}</span>
                    <span className="text-xs text-muted-foreground ml-3">{a.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">${a.price.toLocaleString()}</span>
                    <motion.span 
                      className={`w-2 h-2 rounded-full ${a.price > ASSETS.find(x => x.id === a.id)!.price * 0.999 ? 'bg-success' : 'bg-danger'}`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
              </HoverRevealItem>
            ))}
          </motion.div>

          {/* Support Section */}
          <motion.div 
            variants={fadeInUp}
            className="mt-12 p-6 border border-border cursor-pointer group"
            onClick={() => setShowPaymentModal(true)}
            whileHover={{ backgroundColor: 'rgba(39, 39, 42, 0.5)' }}
          >
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">{t('buyTea')}</p>
            <p className="text-sm font-light mb-4">{t('supportDesc')}</p>
            <span className="text-xs tracking-wider uppercase text-muted-foreground group-hover:text-foreground transition-colors">
              {t('treat')} &rarr;
            </span>
          </motion.div>
        </motion.aside>

        {/* Center - Main Trading Area */}
        <main className="flex-1 ml-80 mr-96 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Asset Header */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-4">
                {activeAsset.zone} / {activeAsset.name}
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <AnimatedText 
                    text={`$${activeAsset.price.toLocaleString()}`}
                    className="text-7xl font-light tracking-tight"
                  />
                </div>
                <motion.div 
                  className="flex items-center gap-2 pb-4"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-xs tracking-wider uppercase">Live</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Chart Section */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs tracking-[0.3em] text-muted-foreground uppercase">{t('priceChart')}</h3>
                <div className="flex gap-1">
                  {(['1m', '10m', '1h', '1d', '1mo', '1y'] as const).map(range => (
                    <button
                      key={range}
                      onClick={() => setChartRange(range)}
                      className={`px-3 py-1 text-xs tracking-wider transition-colors ${
                        chartRange === range 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {t(range)}
                    </button>
                  ))}
                </div>
              </div>
              <div ref={chartContainerRef} className="w-full h-[350px] border border-border" />
            </motion.div>

            {/* Trading Panel */}
            <motion.div 
              className="p-8 border border-border mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <label className="text-xs tracking-[0.3em] text-muted-foreground uppercase block mb-4">
                    {t('quantity')}
                  </label>
                  <input
                    type="number"
                    value={amt}
                    onChange={e => setAmt(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-4xl font-light bg-transparent border-b border-border focus:border-primary outline-none pb-4 placeholder:text-muted-foreground"
                  />
                  <p className="mt-4 text-sm text-muted-foreground">
                    {t('estimated')} ${((parseFloat(amt) || 0) * activeAsset.price).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-4 justify-center">
                  <MagneticButton onClick={() => trade('buy')} className="w-full">
                    {t('buy')}
                  </MagneticButton>
                  <MagneticButton onClick={() => trade('sell')} variant="outline" className="w-full">
                    {t('sell')}
                  </MagneticButton>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
              className="grid grid-cols-3 gap-6 mb-12"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                variants={scaleIn}
                className="p-6 border border-border"
              >
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">{t('cash')}</p>
                <p className="font-mono text-2xl">${balance.toLocaleString()}</p>
              </motion.div>
              <motion.div 
                variants={scaleIn}
                className="p-6 border border-border"
              >
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">{t('equity')}</p>
                <p className="font-mono text-2xl text-success">${totalEquity.toLocaleString()}</p>
              </motion.div>
              <motion.div 
                variants={scaleIn}
                className="p-6 border border-border cursor-pointer hover:bg-secondary transition-colors"
                onClick={() => setShowLevelModal(true)}
              >
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">{t('level')}</p>
                <p className="font-mono text-2xl">{getCurrentLevel(exp, lang)}</p>
              </motion.div>
            </motion.div>

            {/* Portfolio Bar */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-4 text-center">{t('portfolio')}</p>
              <div className="flex h-1 w-full overflow-hidden bg-secondary">
                {prices.map(a => {
                  const qty = shares[a.id] || 0;
                  const weight = totalEquity > 0 ? (qty * a.price) / totalEquity * 100 : 0;
                  return (
                    <motion.div 
                      key={a.id} 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${weight}%` }}
                      transition={{ duration: 0.8 }}
                      title={`${a.id}: ${weight.toFixed(1)}%`}
                    />
                  );
                })}
              </div>
              {totalEquity === 0 && (
                <p className="text-xs text-center mt-4 text-muted-foreground">{t('noPosition')}</p>
              )}
            </motion.div>

            {/* Progress Bar */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">{t('nextReward')}</p>
                <p className="text-xs text-muted-foreground">{currentProgress}%</p>
              </div>
              <div className="h-1 w-full bg-secondary overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>

            {/* Food Collection */}
            {unlockedFoods.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6 text-center">{t('foodGallery')}</p>
                <div className="grid grid-cols-4 gap-4">
                  {unlockedFoods.slice(0, 8).map((food, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="aspect-square border border-border flex flex-col items-center justify-center p-4 hover:bg-secondary transition-colors"
                      title={food.desc}
                    >
                      <span className="font-mono text-2xl mb-2">{food.icon}</span>
                      <span className="text-xs tracking-wider">{food.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </main>

        {/* Right Sidebar - News */}
        <motion.aside 
          className="w-96 border-l border-border p-6 overflow-y-auto fixed right-0 top-20 bottom-0 bg-background"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="mb-8">
            <input
              type="text"
              placeholder={t('searchNews')}
              value={newsSearchTerm}
              onChange={(e) => setNewsSearchTerm(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-transparent border-b border-border focus:border-primary outline-none transition-colors placeholder:text-muted-foreground"
            />
          </div>
          
          <p className="text-xs tracking-[0.3em] text-muted-foreground mb-6 uppercase">{t('intelligence')}</p>
          
          <div className="space-y-0">
            {paginatedNews.map((n, index) => (
              <HoverRevealItem
                key={n.id}
                onClick={() => setSelectedNews(n)}
                imageUrl={n.imageUrl}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] tracking-wider uppercase ${
                    n.impact === 'positive' ? 'text-success' : 
                    n.impact === 'warning' ? 'text-danger' : 'text-muted-foreground'
                  }`}>
                    {lang === 'zh' ? n.tag : n.tagEn}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{n.sourceEn}</span>
                </div>
                <h4 className="text-sm font-light leading-relaxed">{lang === 'zh' ? n.title : n.titleEn}</h4>
              </HoverRevealItem>
            ))}
            <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
              {paginatedNews.length < filteredNews.length && (
                <motion.span 
                  className="text-xs text-muted-foreground"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Loading more...
                </motion.span>
              )}
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showLevelModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowLevelModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="bg-background border border-border p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-light mb-8">{t('levelTitle')}</h2>
              <div className="space-y-4">
                {LEVELS.map((level, idx) => {
                  const isCurrent = exp >= level.threshold && (idx === LEVELS.length - 1 || exp < LEVELS[idx + 1].threshold);
                  const isLocked = exp < level.threshold;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: isLocked ? 0.4 : 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 border ${isCurrent ? 'border-primary bg-secondary' : 'border-border'}`}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-mono">{lang === 'zh' ? level.zh : level.en}</h3>
                        <span className="text-xs text-muted-foreground">{level.threshold} {t('expRequired')}</span>
                      </div>
                      {isCurrent && <p className="text-xs text-primary mt-2">{t('currentLevel')}</p>}
                    </motion.div>
                  );
                })}
              </div>
              <MagneticButton onClick={() => setShowLevelModal(false)} variant="outline" className="w-full mt-8">
                Close
              </MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="bg-background border border-border p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-light mb-8">{t('selectDrink')}</h2>
              <div className="space-y-3 mb-8">
                {Object.entries(drinkNames).map(([key, name]) => (
                  <label 
                    key={key} 
                    className={`flex items-center p-4 border cursor-pointer transition-colors ${
                      selectedDrink === key ? 'border-primary bg-secondary' : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="drink" 
                      value={key} 
                      checked={selectedDrink === key} 
                      onChange={() => setSelectedDrink(key as typeof selectedDrink)} 
                      className="sr-only" 
                    />
                    <span className="flex-1">{name}</span>
                    <span className="font-mono">${drinkPrices[key as keyof typeof drinkPrices]}</span>
                  </label>
                ))}
              </div>
              <div className="mb-8">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-4">{t('paymentMethod')}</p>
                <div className="flex gap-2">
                  {(['wechat', 'alipay', 'visa'] as const).map(method => (
                    <button 
                      key={method}
                      onClick={() => setPaymentMethod(method)} 
                      className={`flex-1 py-3 border text-xs uppercase tracking-wider transition-colors ${
                        paymentMethod === method ? 'border-primary bg-secondary' : 'border-border'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
              <MagneticButton onClick={handlePayment} className="w-full">
                {t('pay')}
              </MagneticButton>
              <button 
                onClick={() => setShowPaymentModal(false)} 
                className="w-full mt-4 py-3 text-muted-foreground text-sm hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHistoryModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowHistoryModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="bg-background border border-border p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-light mb-8">{t('tradeHistory')}</h2>
              {tradeHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">{t('noHistory')}</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr className="text-xs tracking-wider text-muted-foreground uppercase">
                      <th className="text-left py-4">{t('time')}</th>
                      <th className="text-left">{t('symbol')}</th>
                      <th className="text-left">{t('direction')}</th>
                      <th className="text-right">{t('priceUnit')}</th>
                      <th className="text-right">{t('qtyUnit')}</th>
                      <th className="text-right">{t('totalAmount')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradeHistory.map((record, idx) => (
                      <motion.tr 
                        key={record.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-border last:border-0"
                      >
                        <td className="py-4 text-muted-foreground">{record.dateStr}</td>
                        <td className="font-mono">{record.symbol}</td>
                        <td className={record.direction === 'buy' ? 'text-success' : 'text-danger'}>
                          {t(record.direction === 'buy' ? 'buyDirection' : 'sellDirection')}
                        </td>
                        <td className="text-right font-mono">${record.price.toFixed(2)}</td>
                        <td className="text-right font-mono">{record.quantity}</td>
                        <td className="text-right font-mono">${record.total.toFixed(2)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
              <MagneticButton onClick={() => setShowHistoryModal(false)} variant="outline" className="w-full mt-8">
                Close
              </MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedNews && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedNews(null)}
          >
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="bg-background border border-border p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                <span className={`uppercase tracking-wider ${
                  selectedNews.impact === 'positive' ? 'text-success' : 
                  selectedNews.impact === 'warning' ? 'text-danger' : ''
                }`}>
                  {lang === 'zh' ? selectedNews.tag : selectedNews.tagEn}
                </span>
                <span>{selectedNews.sourceEn}</span>
                <span>{selectedNews.date}</span>
              </div>
              <h2 className="text-3xl font-light mb-6 leading-tight">
                {lang === 'zh' ? selectedNews.title : selectedNews.titleEn}
              </h2>
              {selectedNews.imageUrl && (
                <motion.img 
                  src={selectedNews.imageUrl} 
                  alt="" 
                  className="w-full h-64 object-cover mb-6 grayscale hover:grayscale-0 transition-all duration-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />
              )}
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {lang === 'zh' ? selectedNews.fullContent : selectedNews.fullContentEn}
              </p>
              <MagneticButton onClick={() => setSelectedNews(null)} variant="outline" className="w-full mt-8">
                {t('backToList')}
              </MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (currentPage === 'login') return renderLoginPage();
  return renderHome();
}
