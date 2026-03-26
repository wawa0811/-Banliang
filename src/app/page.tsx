'use client';

import React, { useState, useEffect, useMemo, useRef, createContext, useContext } from 'react';
import { createChart, CrosshairMode, CandlestickSeries } from 'lightweight-charts';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

// -------------------- Language Context --------------------
type Language = 'en' | 'cn';

const translations = {
  en: {
    // Hero
    heroSubtitle: 'Global Trading Simulator',
    heroTitle1: 'The Art of',
    heroTitle2: 'Trading',
    heroTitle3: 'Refined',
    heroDesc: 'Experience the elegance of global markets with zero risk. Master your craft in a sanctuary of simulated trading.',
    startTrading: 'Enter Platform',
    viewMarkets: 'Explore Markets',
    scroll: 'Discover',
    // Nav
    markets: 'Markets',
    about: 'About',
    login: 'Sign In',
    // Markets
    liveMarkets: 'Live Markets',
    globalOpportunities: 'Global',
    opportunities: 'Opportunities',
    marketsDesc: 'Access markets across North America, Europe, and Asia. Real-time data, professional tools, zero commission.',
    northAmerica: 'North America',
    europe: 'Europe',
    asiaPacific: 'Asia Pacific',
    // Stats
    totalVolume: 'Total Volume',
    activeTraders: 'Active Traders',
    markets_text: 'Markets',
    uptime: 'Uptime',
    // About
    aboutTitle: 'Philosophy',
    aboutSubtitle: 'A Different Approach',
    aboutDesc: 'We believe that trading education should be accessible, elegant, and risk-free. Our platform combines sophisticated market simulation with an artistic sensibility that transforms learning into an experience.',
    learnMore: 'Learn More',
    // CTA
    ctaTitle: 'Begin Your Journey',
    ctaDesc: 'Join thousands of traders perfecting their craft in our simulated environment.',
    createAccount: 'Create Account',
    // Footer
    copyright: 'All rights reserved.',
    // Trading
    tradingPlatform: 'Trading Platform',
    back: 'Back',
    history: 'History',
    netWorth: 'Net Worth',
    searchSymbol: 'Search symbol or name',
    liveMarket: 'Live Market',
    buyDevTea: 'Support the Developer',
    unlockFlavors: 'Unlock more features',
    treat: 'Treat',
    quantity: 'Quantity',
    buy: 'Buy',
    sell: 'Sell',
    cash: 'Cash',
    equity: 'Equity',
    level: 'Level',
    portfolio: 'Portfolio',
    noPositions: 'No positions yet',
    nextReward: 'Next Reward',
    foodGallery: 'Collection',
    priceChart: 'Price Chart',
    live: 'Live',
    intelligence: 'Intelligence',
    loadingMore: 'Loading more...',
    // Modals
    investmentLevels: 'Investment Levels',
    currentLevel: 'Current Level',
    close: 'Close',
    selectDrink: 'Select Support',
    paymentMethod: 'Payment Method',
    payNow: 'Pay Now',
    cancel: 'Cancel',
    tradeHistory: 'Trade History',
    noTrades: 'No trades yet',
    time: 'Time',
    symbol: 'Symbol',
    direction: 'Direction',
    price: 'Price',
    qty: 'Qty',
    total: 'Total',
    // Login
    loginTitle: 'Welcome',
    registerTitle: 'Join Us',
    username: 'Username',
    password: 'Password',
    noAccount: "Don't have an account?",
    register: 'Register',
    hasAccount: 'Already have an account?',
    email: 'Email',
    phone: 'Phone',
    confirmPassword: 'Confirm Password',
    insufficientBalance: 'Insufficient Balance',
    insufficientShares: 'Insufficient Shares',
    loginFirst: 'Please sign in first',
    paymentSuccess: 'Payment successful!',
    passwordMismatch: 'Passwords do not match',
    enterCredentials: 'Please enter username and password',
  },
  cn: {
    // Hero
    heroSubtitle: '全球交易模拟器',
    heroTitle1: '交易的',
    heroTitle2: '艺术',
    heroTitle3: '臻善',
    heroDesc: '在零风险的环境中体验全球市场的优雅。在模拟交易的圣殿中精进您的技艺。',
    startTrading: '进入平台',
    viewMarkets: '探索市场',
    scroll: '探索',
    // Nav
    markets: '市场',
    about: '关于',
    login: '登录',
    // Markets
    liveMarkets: '实时行情',
    globalOpportunities: '全球',
    opportunities: '机遇',
    marketsDesc: '覆盖北美、欧洲和亚太市场。实时数据，专业工具，零佣金模拟。',
    northAmerica: '北美',
    europe: '欧洲',
    asiaPacific: '亚太',
    // Stats
    totalVolume: '总成交量',
    activeTraders: '活跃交易者',
    markets_text: '市场数量',
    uptime: '运行时间',
    // About
    aboutTitle: '理念',
    aboutSubtitle: '不同的方式',
    aboutDesc: '我们相信交易教育应该是易于获取的、优雅的、零风险的。我们的平台将精密的市场模拟与艺术感相结合，将学习转化为一种体验。',
    learnMore: '了解更多',
    // CTA
    ctaTitle: '开启您的旅程',
    ctaDesc: '加入数千名在模拟环境中精进技艺的交易者。',
    createAccount: '创建账户',
    // Footer
    copyright: '版权所有',
    // Trading
    tradingPlatform: '交易平台',
    back: '返回',
    history: '历史',
    netWorth: '净资产',
    searchSymbol: '搜索代码或名称',
    liveMarket: '实时行情',
    buyDevTea: '支持开发者',
    unlockFlavors: '解锁更多功能',
    treat: '打赏',
    quantity: '数量',
    buy: '买入',
    sell: '卖出',
    cash: '现金',
    equity: '持仓',
    level: '等级',
    portfolio: '组合',
    noPositions: '暂无持仓',
    nextReward: '下个奖励',
    foodGallery: '收藏品',
    priceChart: '价格图表',
    live: '实时',
    intelligence: '资讯',
    loadingMore: '加载中...',
    // Modals
    investmentLevels: '投资等级',
    currentLevel: '当前等级',
    close: '关闭',
    selectDrink: '选择支持',
    paymentMethod: '支付方式',
    payNow: '立即支付',
    cancel: '取消',
    tradeHistory: '交易历史',
    noTrades: '暂无交易',
    time: '时间',
    symbol: '代码',
    direction: '方向',
    price: '价格',
    qty: '数量',
    total: '总额',
    // Login
    loginTitle: '欢迎',
    registerTitle: '加入我们',
    username: '用户名',
    password: '密码',
    noAccount: '还没有账户？',
    register: '注册',
    hasAccount: '已有账户？',
    email: '邮箱',
    phone: '电话',
    confirmPassword: '确认密码',
    insufficientBalance: '余额不足',
    insufficientShares: '持仓不足',
    loginFirst: '请先登录',
    paymentSuccess: '支付成功！',
    passwordMismatch: '密码不匹配',
    enterCredentials: '请输入用户名和密码',
  }
};

const LanguageContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
}>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
});

const useLanguage = () => useContext(LanguageContext);

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
  { threshold: 0, name: 'Sprout', nameCn: '新芽' },
  { threshold: 100, name: 'Quick Hand', nameCn: '快手' },
  { threshold: 500, name: 'Apprentice', nameCn: '学徒' },
  { threshold: 1000, name: 'Legendary', nameCn: '传奇' },
];

// -------------------- News Data --------------------
const NEWS_TEMPLATES = [
  { tag: 'Macro', impact: 'positive', titles: ['Fed Holds Rates Steady', 'Non-Farm Data Beats', 'Inflation Cools', 'GDP Revised Up', 'Consumer Confidence Rises'] },
  { tag: 'Tech', impact: 'positive', titles: ['NVIDIA New Architecture', 'Apple WWDC', 'AI Chip Demand Surges', 'Microsoft Cloud Growth', 'Google Quantum Push'] },
  { tag: 'Asia', impact: 'warning', titles: ['Yen Volatility Spikes', 'HSI Technical Pullback', 'China Data Release', 'Korean Outflows', 'SEA Markets Choppy'] },
  { tag: 'Flash', impact: 'neutral', titles: ['Analyst Risk Alert', 'Geopolitical Impact', 'Commodity Price Move', 'Exchange Tech Issue', 'Earnings Season Begins'] },
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
      title: template.titles[titleIndex],
      body: 'Summary content, click for details.',
      impact: template.impact,
      source: ['Reuters', 'Bloomberg', 'CNBC', 'Banliang'][i % 4],
      date: date.toISOString().split('T')[0],
      fullContent: `Full content: ${template.titles[titleIndex]}. This is simulated news content.`,
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

// Smooth Scroll Hook
function useSmoothScroll() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return scrollTo;
}

// Parallax Text Component
function ParallaxText({ children, baseVelocity = 5 }: { children: React.ReactNode; baseVelocity?: number }) {
  const baseX = useMotionValue(0);
  const x = useSpring(baseX, { damping: 50, stiffness: 400 });

  useEffect(() => {
    let animationId: number;
    let lastTime = 0;
    
    const animate = (time: number) => {
      if (lastTime !== 0) {
        const delta = time - lastTime;
        baseX.set(baseX.get() - baseVelocity * (delta / 50));
        if (baseX.get() < -1000) baseX.set(0);
      }
      lastTime = time;
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [baseVelocity, baseX]);

  return (
    <motion.div style={{ x }} className="flex whitespace-nowrap">
      {[...Array(4)].map((_, i) => (
        <span key={i} className="mx-8">{children}</span>
      ))}
    </motion.div>
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

  const baseStyles = "relative overflow-hidden font-medium tracking-wide uppercase text-xs cursor-pointer";
  const variantStyles = {
    primary: "bg-foreground text-background px-8 py-4 hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground px-6 py-3",
    outline: "border border-foreground/30 px-6 py-3 hover:bg-foreground hover:text-background"
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
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// Reveal Section Component
function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Hover Reveal Item
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
      className={`relative cursor-pointer py-4 border-b border-border/50 group ${isActive ? 'bg-secondary/50' : ''}`}
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
            className="fixed pointer-events-none z-50 w-64 h-40 overflow-hidden rounded-sm"
            style={{ 
              left: mousePosition.x + 20, 
              top: mousePosition.y - 80,
            }}
          >
            <img 
              src={imageUrl} 
              alt="" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Animated Counter
function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-mono">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

// Language Switcher
function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  
  return (
    <div className="flex items-center gap-1 text-xs">
      <button 
        onClick={() => setLang('en')}
        className={`px-2 py-1 transition-colors ${lang === 'en' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      >
        EN
      </button>
      <span className="text-border">/</span>
      <button 
        onClick={() => setLang('cn')}
        className={`px-2 py-1 transition-colors font-cn ${lang === 'cn' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      >
        中文
      </button>
    </div>
  );
}

export default function Home() {
  const scrollTo = useSmoothScroll();
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];
  
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
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'trading'>('home');
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
  const [allNews] = useState(INITIAL_NEWS_POOL);
  const [newsSearchTerm, setNewsSearchTerm] = useState('');
  const filteredNews = useMemo(() => {
    if (!newsSearchTerm.trim()) return allNews;
    const term = newsSearchTerm.toLowerCase();
    return allNews.filter(n => 
      n.title.toLowerCase().includes(term) ||
      n.body.toLowerCase().includes(term)
    );
  }, [newsSearchTerm, allNews]);

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
        alert(t.insufficientBalance);
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
        alert(t.insufficientShares);
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
  const drinkNames = { americano: 'Iced Americano', cappuccino: 'Cappuccino', caramel: 'Caramel Latte' };

  const handlePayment = () => {
    if (!user) {
      alert(t.loginFirst);
      setCurrentPage('login');
      return;
    }
    alert(t.paymentSuccess);
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
      alert(t.enterCredentials);
    }
  };

  const handleRegister = () => {
    if (registerForm.password !== registerForm.confirm) {
      alert(t.passwordMismatch);
      return;
    }
    setUser({ username: registerForm.username, wechatBound: !!registerForm.wechat });
    setCurrentPage('home');
  };

  const getCurrentLevel = (exp: number) => {
    const level = LEVELS.filter(l => l.threshold <= exp).slice(-1)[0];
    return lang === 'cn' ? level.nameCn : level.name;
  };

  // Chart Initialization
  useEffect(() => {
    if (!chartContainerRef.current || currentPage !== 'trading') return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#faf8f5' },
        textColor: '#78716c',
      },
      grid: {
        vertLines: { color: '#e7e5e4' },
        horzLines: { color: '#e7e5e4' },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: '#d6d3d1' },
      timeScale: { borderColor: '#d6d3d1', timeVisible: true, secondsVisible: false },
    });
    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#166534',
      downColor: '#991b1b',
      borderVisible: false,
      wickUpColor: '#166534',
      wickDownColor: '#991b1b',
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
  }, [currentPage]);

  useEffect(() => {
    if (seriesRef.current && staticChartData.length && currentPage === 'trading') {
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
  }, [staticChartData, currentPage]);

  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const headerBg = useTransform(scrollYProgress, [0, 0.1], ['rgba(250, 248, 245, 0)', 'rgba(250, 248, 245, 0.95)']);

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
        className="w-full max-w-md p-12 border border-border bg-card"
      >
        <motion.h2 
          className={`text-4xl font-light tracking-tight text-center mb-12 ${lang === 'cn' ? 'font-cn' : 'font-serif italic'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isLogin ? t.loginTitle : t.registerTitle}
        </motion.h2>
        
        {isLogin ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <input
              type="text"
              placeholder={t.username}
              className="w-full p-4 mb-6 bg-transparent border-b border-border focus:border-accent outline-none transition-colors text-foreground placeholder:text-muted-foreground"
              value={loginForm.username}
              onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
            />
            <input
              type="password"
              placeholder={t.password}
              className="w-full p-4 mb-10 bg-transparent border-b border-border focus:border-accent outline-none transition-colors text-foreground placeholder:text-muted-foreground"
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            <MagneticButton onClick={handleLogin} className="w-full">
              {t.login}
            </MagneticButton>
            <p className={`text-center mt-8 text-sm text-muted-foreground ${lang === 'cn' ? 'font-cn' : ''}`}>
              {t.noAccount}{' '}
              <button onClick={() => setIsLogin(false)} className="text-accent underline underline-offset-4 hover:text-foreground transition-colors">
                {t.register}
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
            <input type="text" placeholder={t.username} className="w-full p-4 bg-transparent border-b border-border focus:border-accent outline-none transition-colors" value={registerForm.username} onChange={e => setRegisterForm({ ...registerForm, username: e.target.value })} />
            <input type="email" placeholder={t.email} className="w-full p-4 bg-transparent border-b border-border focus:border-accent outline-none transition-colors" value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} />
            <input type="tel" placeholder={t.phone} className="w-full p-4 bg-transparent border-b border-border focus:border-accent outline-none transition-colors" value={registerForm.phone} onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })} />
            <input type="password" placeholder={t.password} className="w-full p-4 bg-transparent border-b border-border focus:border-accent outline-none transition-colors" value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} />
            <input type="password" placeholder={t.confirmPassword} className="w-full p-4 bg-transparent border-b border-border focus:border-accent outline-none transition-colors" value={registerForm.confirm} onChange={e => setRegisterForm({ ...registerForm, confirm: e.target.value })} />
            <div className="pt-6">
              <MagneticButton onClick={handleRegister} className="w-full">
                {t.register}
              </MagneticButton>
            </div>
            <p className={`text-center pt-4 text-sm text-muted-foreground ${lang === 'cn' ? 'font-cn' : ''}`}>
              {t.hasAccount}{' '}
              <button onClick={() => setIsLogin(true)} className="text-accent underline underline-offset-4">
                {t.login}
              </button>
            </p>
          </motion.div>
        )}
        
        <motion.button
          onClick={() => setCurrentPage('home')}
          className="w-full mt-6 py-3 text-muted-foreground text-sm hover:text-foreground transition-colors"
          whileHover={{ x: -5 }}
        >
          &larr; {t.back}
        </motion.button>
      </motion.div>
    </motion.div>
  );

  // Trading Platform Page
  const renderTradingPage = () => (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Trading Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-8 border-b border-border bg-background/95 backdrop-blur-xl z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-6">
          <button onClick={() => setCurrentPage('home')} className="text-muted-foreground hover:text-foreground transition-colors">
            &larr; {t.back}
          </button>
          <h1 className={`font-light text-sm tracking-[0.3em] uppercase ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.tradingPlatform}</h1>
        </div>

        <div className="flex items-center gap-8">
          <LanguageSwitcher />
          <button 
            onClick={() => setShowHistoryModal(true)} 
            className={`text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors uppercase ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}
          >
            {t.history}
          </button>

          <div className="text-right">
            <p className={`text-[10px] tracking-[0.2em] text-muted-foreground uppercase ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.netWorth}</p>
            <motion.p 
              className="font-mono text-lg text-accent"
              key={balance + totalEquity}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ${(balance + totalEquity).toLocaleString()}
            </motion.p>
          </div>

          {user ? (
            <span className="text-xs px-4 py-2 border border-border text-muted-foreground">
              {user.username}
            </span>
          ) : (
            <MagneticButton onClick={() => setCurrentPage('login')} variant="outline">
              {t.login}
            </MagneticButton>
          )}
        </div>
      </motion.header>

      {/* Trading Content */}
      <div className="flex flex-1 pt-16">
        {/* Left Sidebar - Market */}
        <motion.aside 
          className="w-80 border-r border-border p-6 overflow-y-auto fixed left-0 top-16 bottom-0 bg-background"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <input
              type="text"
              placeholder={t.searchSymbol}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-transparent border-b border-border focus:border-accent outline-none transition-colors placeholder:text-muted-foreground"
            />
          </div>
          
          <p className={`text-[10px] tracking-[0.3em] text-muted-foreground mb-6 uppercase ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.liveMarket}</p>
          
          <div>
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
          </div>

          {/* Support Section */}
          <motion.div 
            className="mt-12 p-6 border border-border cursor-pointer group bg-card"
            onClick={() => setShowPaymentModal(true)}
            whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
          >
            <p className={`text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2 ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.buyDevTea}</p>
            <p className={`text-sm font-light mb-4 text-foreground/80 ${lang === 'cn' ? 'font-cn' : ''}`}>{t.unlockFlavors}</p>
            <span className={`text-xs tracking-wider uppercase text-accent group-hover:text-foreground transition-colors ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>
              {t.treat} &rarr;
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
                  <span className="text-7xl font-light tracking-tight text-accent font-serif">
                    ${activeAsset.price.toLocaleString()}
                  </span>
                </div>
                <motion.div 
                  className="flex items-center gap-2 pb-4"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-2 h-2 rounded-full bg-success" />
                  <span className={`text-xs tracking-wider uppercase ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.live}</span>
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
                <h3 className={`text-xs tracking-[0.3em] text-muted-foreground uppercase ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.priceChart}</h3>
                <div className="flex gap-1">
                  {(['1m', '10m', '1h', '1d', '1mo', '1y'] as const).map(range => (
                    <button
                      key={range}
                      onClick={() => setChartRange(range)}
                      className={`px-3 py-1 text-xs tracking-wider transition-colors ${
                        chartRange === range 
                          ? 'bg-foreground text-background' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div ref={chartContainerRef} className="w-full h-[400px] border border-border bg-card" />
            </motion.div>

            {/* Trading Panel */}
            <motion.div 
              className="p-8 border border-border mb-12 bg-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <label className={`text-xs tracking-[0.3em] text-muted-foreground uppercase block mb-4 ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>
                    {t.quantity}
                  </label>
                  <input
                    type="number"
                    value={amt}
                    onChange={e => setAmt(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-4xl font-light bg-transparent border-b border-border focus:border-accent outline-none pb-4 placeholder:text-muted-foreground"
                  />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Est. ${((parseFloat(amt) || 0) * activeAsset.price).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-4 justify-center">
                  <MagneticButton onClick={() => trade('buy')} className="w-full">
                    {t.buy}
                  </MagneticButton>
                  <MagneticButton onClick={() => trade('sell')} variant="outline" className="w-full">
                    {t.sell}
                  </MagneticButton>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
              className="grid grid-cols-3 gap-6 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div 
                className="p-6 border border-border bg-card"
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
              >
                <p className={`text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2 ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.cash}</p>
                <p className="font-mono text-2xl">${balance.toLocaleString()}</p>
              </motion.div>
              <motion.div 
                className="p-6 border border-border bg-card"
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
              >
                <p className={`text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2 ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.equity}</p>
                <p className="font-mono text-2xl text-success">${totalEquity.toLocaleString()}</p>
              </motion.div>
              <motion.div 
                className="p-6 border border-border bg-card cursor-pointer"
                onClick={() => setShowLevelModal(true)}
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
              >
                <p className={`text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2 ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.level}</p>
                <p className={`font-mono text-2xl ${lang === 'cn' ? 'font-cn' : ''}`}>{getCurrentLevel(exp)}</p>
              </motion.div>
            </motion.div>

            {/* Portfolio Bar */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className={`text-xs tracking-[0.3em] text-muted-foreground uppercase mb-4 text-center ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.portfolio}</p>
              <div className="flex h-1 w-full overflow-hidden bg-secondary rounded-full">
                {prices.map(a => {
                  const qty = shares[a.id] || 0;
                  const weight = totalEquity > 0 ? (qty * a.price) / totalEquity * 100 : 0;
                  return (
                    <motion.div 
                      key={a.id} 
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${weight}%` }}
                      transition={{ duration: 0.8 }}
                      title={`${a.id}: ${weight.toFixed(1)}%`}
                    />
                  );
                })}
              </div>
              {totalEquity === 0 && (
                <p className={`text-xs text-center mt-4 text-muted-foreground ${lang === 'cn' ? 'font-cn' : ''}`}>{t.noPositions}</p>
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
                <p className={`text-xs tracking-[0.2em] text-muted-foreground uppercase ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.nextReward}</p>
                <p className="text-xs text-muted-foreground">{currentProgress}%</p>
              </div>
              <div className="h-1 w-full bg-secondary overflow-hidden rounded-full">
                <motion.div 
                  className="h-full bg-accent"
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
                <p className={`text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6 text-center ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.foodGallery}</p>
                <div className="grid grid-cols-4 gap-4">
                  {unlockedFoods.slice(0, 8).map((food, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="aspect-square border border-border flex flex-col items-center justify-center p-4 hover:bg-secondary/30 transition-colors bg-card"
                      title={food.desc}
                    >
                      <span className="font-mono text-2xl mb-2 text-accent">{food.icon}</span>
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
          className="w-96 border-l border-border p-6 overflow-y-auto fixed right-0 top-16 bottom-0 bg-background"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search news..."
              value={newsSearchTerm}
              onChange={(e) => setNewsSearchTerm(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-transparent border-b border-border focus:border-accent outline-none transition-colors placeholder:text-muted-foreground"
            />
          </div>
          
          <p className={`text-xs tracking-[0.3em] text-muted-foreground mb-6 uppercase ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.intelligence}</p>
          
          <div className="space-y-0">
            {paginatedNews.map((n) => (
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
                    {n.tag}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{n.source}</span>
                </div>
                <h4 className="text-sm font-light leading-relaxed">{n.title}</h4>
              </HoverRevealItem>
            ))}
            <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
              {paginatedNews.length < filteredNews.length && (
                <motion.span 
                  className={`text-xs text-muted-foreground ${lang === 'cn' ? 'font-cn' : ''}`}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {t.loadingMore}
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
            className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowLevelModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="bg-background border border-border p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h2 className={`text-2xl font-light mb-8 ${lang === 'cn' ? 'font-cn' : 'font-serif italic'}`}>{t.investmentLevels}</h2>
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
                      className={`p-4 border ${isCurrent ? 'border-accent bg-card' : 'border-border'}`}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className={`font-mono ${lang === 'cn' ? 'font-cn' : ''}`}>{lang === 'cn' ? level.nameCn : level.name}</h3>
                        <span className="text-xs text-muted-foreground">{level.threshold} EXP</span>
                      </div>
                      {isCurrent && <p className={`text-xs text-accent mt-2 ${lang === 'cn' ? 'font-cn' : ''}`}>{t.currentLevel}</p>}
                    </motion.div>
                  );
                })}
              </div>
              <MagneticButton onClick={() => setShowLevelModal(false)} variant="outline" className="w-full mt-8">
                {t.close}
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
            className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="bg-background border border-border p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h2 className={`text-2xl font-light mb-8 ${lang === 'cn' ? 'font-cn' : 'font-serif italic'}`}>{t.selectDrink}</h2>
              <div className="space-y-3 mb-8">
                {Object.entries(drinkNames).map(([key, name]) => (
                  <label 
                    key={key} 
                    className={`flex items-center p-4 border cursor-pointer transition-colors ${
                      selectedDrink === key ? 'border-accent bg-card' : 'border-border hover:border-muted-foreground'
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
                    <span className="font-mono text-accent">${drinkPrices[key as keyof typeof drinkPrices]}</span>
                  </label>
                ))}
              </div>
              <div className="mb-8">
                <p className={`text-xs tracking-[0.2em] text-muted-foreground uppercase mb-4 ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.paymentMethod}</p>
                <div className="flex gap-2">
                  {(['wechat', 'alipay', 'visa'] as const).map(method => (
                    <button 
                      key={method}
                      onClick={() => setPaymentMethod(method)} 
                      className={`flex-1 py-3 border text-xs uppercase tracking-wider transition-colors ${
                        paymentMethod === method ? 'border-accent bg-card' : 'border-border'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
              <MagneticButton onClick={handlePayment} className="w-full">
                {t.payNow}
              </MagneticButton>
              <button 
                onClick={() => setShowPaymentModal(false)} 
                className={`w-full mt-4 py-3 text-muted-foreground text-sm hover:text-foreground transition-colors ${lang === 'cn' ? 'font-cn' : ''}`}
              >
                {t.cancel}
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
            className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowHistoryModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="bg-background border border-border p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <h2 className={`text-2xl font-light mb-8 ${lang === 'cn' ? 'font-cn' : 'font-serif italic'}`}>{t.tradeHistory}</h2>
              {tradeHistory.length === 0 ? (
                <p className={`text-center text-muted-foreground py-12 ${lang === 'cn' ? 'font-cn' : ''}`}>{t.noTrades}</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr className={`text-xs tracking-wider text-muted-foreground uppercase ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>
                      <th className="text-left py-4">{t.time}</th>
                      <th className="text-left">{t.symbol}</th>
                      <th className="text-left">{t.direction}</th>
                      <th className="text-right">{t.price}</th>
                      <th className="text-right">{t.qty}</th>
                      <th className="text-right">{t.total}</th>
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
                          {record.direction === 'buy' ? t.buy : t.sell}
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
                {t.close}
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
            className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50"
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
                  {selectedNews.tag}
                </span>
                <span>{selectedNews.source}</span>
                <span>{selectedNews.date}</span>
              </div>
              <h2 className="text-3xl font-light mb-6 leading-tight font-serif">
                {selectedNews.title}
              </h2>
              {selectedNews.imageUrl && (
                <motion.img 
                  src={selectedNews.imageUrl} 
                  alt="" 
                  className="w-full h-64 object-cover mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />
              )}
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {selectedNews.fullContent}
              </p>
              <MagneticButton onClick={() => setSelectedNews(null)} variant="outline" className="w-full mt-8">
                {t.back}
              </MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Home Page with Hero
  const renderHome = () => (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Fixed Header */}
      <motion.header 
        style={{ backgroundColor: headerBg }}
        className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 md:px-16 z-50 backdrop-blur-sm"
      >
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-10 h-10 bg-foreground flex items-center justify-center">
            <span className="text-background font-serif text-sm font-bold italic">B</span>
          </div>
          <span className={`text-sm tracking-[0.4em] uppercase font-light hidden md:block ${lang === 'cn' ? 'font-cn tracking-widest' : ''}`}>Banliang</span>
        </motion.div>

        <motion.nav 
          className="flex items-center gap-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <button onClick={() => scrollTo('markets')} className={`text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>
            {t.markets}
          </button>
          <button onClick={() => scrollTo('about')} className={`text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>
            {t.about}
          </button>
          <LanguageSwitcher />
          {user ? (
            <span className="text-xs tracking-wider text-accent">{user.username}</span>
          ) : (
            <MagneticButton onClick={() => setCurrentPage('login')} variant="outline">
              {t.login}
            </MagneticButton>
          )}
        </motion.nav>
      </motion.header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
          <motion.img
            src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1920&q=80"
            alt="Financial Abstract"
            className="w-full h-full object-cover opacity-20"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-8 max-w-6xl mx-auto">
          <motion.p
            className={`text-xs tracking-[0.5em] uppercase text-muted-foreground mb-8 ${lang === 'cn' ? 'font-cn tracking-[0.3em]' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t.heroSubtitle}
          </motion.p>
          
          <motion.h1 
            className={`text-5xl md:text-8xl lg:text-9xl font-light tracking-tight mb-8 leading-none ${lang === 'cn' ? 'font-cn' : ''}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <span className="block">{t.heroTitle1}</span>
            <span className={`block text-accent ${lang === 'cn' ? '' : 'italic font-serif'}`}>{t.heroTitle2}</span>
            <span className="block">{t.heroTitle3}</span>
          </motion.h1>

          <motion.p
            className={`text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-light leading-relaxed ${lang === 'cn' ? 'font-cn' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {t.heroDesc}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <MagneticButton onClick={() => setCurrentPage('trading')} className="min-w-[200px]">
              {t.startTrading}
            </MagneticButton>
            <MagneticButton onClick={() => scrollTo('markets')} variant="outline" className="min-w-[200px]">
              {t.viewMarkets}
            </MagneticButton>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => scrollTo('markets')}
          >
            <span className={`text-xs tracking-widest uppercase text-muted-foreground ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.scroll}</span>
            <div className="w-px h-12 bg-gradient-to-b from-muted-foreground to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee Section */}
      <section className="py-8 border-y border-border overflow-hidden bg-secondary/30">
        <div className="overflow-hidden">
          <ParallaxText baseVelocity={3}>
            <span className="text-5xl md:text-7xl font-light tracking-tight text-foreground/10 font-serif">
              SPY +0.45% &nbsp; QQQ +0.82% &nbsp; AAPL +1.2% &nbsp; MSFT +0.67% &nbsp; GOOGL +0.34% &nbsp; TSLA -0.91%
            </span>
          </ParallaxText>
        </div>
      </section>

      {/* Markets Section */}
      <section id="markets" className="py-32 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
              <div>
                <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4 ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.liveMarkets}</p>
                <h2 className={`text-4xl md:text-6xl font-light tracking-tight ${lang === 'cn' ? 'font-cn' : ''}`}>
                  {t.globalOpportunities}<br />
                  <span className={`text-accent ${lang === 'cn' ? '' : 'italic font-serif'}`}>{t.opportunities}</span>
                </h2>
              </div>
              <p className={`text-muted-foreground max-w-md mt-8 md:mt-0 text-sm leading-relaxed ${lang === 'cn' ? 'font-cn' : ''}`}>
                {t.marketsDesc}
              </p>
            </div>
          </RevealSection>

          {/* Market Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* NA Markets */}
            <RevealSection className="border border-border p-8 bg-card">
              <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6 ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.northAmerica}</p>
              <div className="space-y-4">
                {prices.filter(a => a.zone === 'NA').slice(0, 4).map(a => (
                  <div key={a.id} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                    <div>
                      <span className="font-mono text-sm">{a.id}</span>
                      <span className="text-xs text-muted-foreground ml-2">{a.name}</span>
                    </div>
                    <span className="font-mono text-accent">${a.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </RevealSection>

            {/* EU Markets */}
            <RevealSection className="border border-border p-8 bg-card">
              <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6 ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.europe}</p>
              <div className="space-y-4">
                {prices.filter(a => a.zone === 'EU').map(a => (
                  <div key={a.id} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                    <div>
                      <span className="font-mono text-sm">{a.id}</span>
                      <span className="text-xs text-muted-foreground ml-2">{a.name}</span>
                    </div>
                    <span className="font-mono text-accent">${a.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </RevealSection>

            {/* Asia Markets */}
            <RevealSection className="border border-border p-8 bg-card">
              <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6 ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.asiaPacific}</p>
              <div className="space-y-4">
                {prices.filter(a => a.zone === 'ASIA').slice(0, 4).map(a => (
                  <div key={a.id} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                    <div>
                      <span className="font-mono text-sm">{a.id}</span>
                      <span className="text-xs text-muted-foreground ml-2">{a.name}</span>
                    </div>
                    <span className="font-mono text-accent">${a.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-8 md:px-16 border-y border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <RevealSection className="text-center">
              <p className="text-4xl md:text-5xl font-light mb-2 font-serif">
                <AnimatedCounter value={2.4} suffix="M" />
              </p>
              <p className={`text-xs tracking-[0.2em] uppercase text-muted-foreground ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.totalVolume}</p>
            </RevealSection>
            <RevealSection className="text-center">
              <p className="text-4xl md:text-5xl font-light mb-2 font-serif">
                <AnimatedCounter value={15000} suffix="+" />
              </p>
              <p className={`text-xs tracking-[0.2em] uppercase text-muted-foreground ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.activeTraders}</p>
            </RevealSection>
            <RevealSection className="text-center">
              <p className="text-4xl md:text-5xl font-light mb-2 font-serif">
                <AnimatedCounter value={15} />
              </p>
              <p className={`text-xs tracking-[0.2em] uppercase text-muted-foreground ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.markets_text}</p>
            </RevealSection>
            <RevealSection className="text-center">
              <p className="text-4xl md:text-5xl font-light mb-2 font-serif">
                <AnimatedCounter value={99.9} suffix="%" />
              </p>
              <p className={`text-xs tracking-[0.2em] uppercase text-muted-foreground ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.uptime}</p>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <RevealSection>
              <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4 ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}>{t.aboutTitle}</p>
              <h2 className={`text-4xl md:text-5xl font-light tracking-tight mb-8 ${lang === 'cn' ? 'font-cn' : ''}`}>
                {t.aboutSubtitle.split(' ')[0]}<br />
                <span className={`text-accent ${lang === 'cn' ? '' : 'italic font-serif'}`}>{t.aboutSubtitle.split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className={`text-muted-foreground leading-relaxed mb-8 ${lang === 'cn' ? 'font-cn' : ''}`}>
                {t.aboutDesc}
              </p>
              <MagneticButton onClick={() => setCurrentPage('trading')} variant="outline">
                {t.learnMore}
              </MagneticButton>
            </RevealSection>
            <RevealSection className="relative">
              <div className="aspect-[4/5] overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80"
                  alt="Trading"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 md:px-16 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center">
          <RevealSection>
            <h2 className={`text-4xl md:text-6xl font-light tracking-tight mb-8 ${lang === 'cn' ? 'font-cn' : ''}`}>
              {t.ctaTitle.split(' ')[0]}<br />
              <span className={`${lang === 'cn' ? '' : 'italic font-serif'}`}>{t.ctaTitle.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className={`text-background/70 mb-12 max-w-xl mx-auto ${lang === 'cn' ? 'font-cn' : ''}`}>
              {t.ctaDesc}
            </p>
            <motion.button
              onClick={() => setCurrentPage(user ? 'trading' : 'login')}
              className={`bg-background text-foreground px-12 py-5 text-xs tracking-wider uppercase hover:bg-accent hover:text-accent-foreground transition-colors ${lang === 'cn' ? 'font-cn tracking-normal' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t.createAccount}
            </motion.button>
          </RevealSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 md:px-16 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-foreground flex items-center justify-center">
              <span className="text-background font-serif text-xs font-bold italic">B</span>
            </div>
            <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Banliang</span>
          </div>
          <p className={`text-xs text-muted-foreground ${lang === 'cn' ? 'font-cn' : ''}`}>
            &copy; 2024 Banliang. {t.copyright}
          </p>
        </div>
      </footer>
    </div>
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <AnimatePresence mode="wait">
        {currentPage === 'login' && renderLoginPage()}
        {currentPage === 'trading' && renderTradingPage()}
        {currentPage === 'home' && renderHome()}
      </AnimatePresence>
    </LanguageContext.Provider>
  );
}
