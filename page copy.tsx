@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --cream: #FEF9E6;
  --ivory: #FFFCF0;
  --warm-gray: #F3EFE2;
  --accent: #C7B48A;
  --accent-dark: #A28F64;
  --text-dark: #2C2A24;
  --text-soft: #5A564A;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    background: var(--cream);
    color: var(--text-dark);
  }
}

/* 自定义动画 */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
@keyframes fade-up {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-up {
  animation: fade-up 0.6s ease-out forwards;
}
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }

/* 手绘装饰元素 */
.hand-drawn {
  position: relative;
}
.hand-drawn::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 2px;
  background: repeating-linear-gradient(90deg, var(--accent), var(--accent) 8px, transparent 8px, transparent 16px);
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['var(--font-inter)', 'system-ui'],
        'serif': ['var(--font-playfair)', '上海宋体', 'serif'],
        'cursive': ['var(--font-cedarville)', 'cursive'],
      },
      colors: {
        cream: '#FEF9E6',
        ivory: '#FFFCF0',
        warmGray: '#F3EFE2',
        accent: '#C7B48A',
        accentDark: '#A28F64',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Cedarville_Cursive } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const cedarville = Cedarville_Cursive({
  variable: "--font-cedarville",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BANLIANG | Global Trading Simulator",
  description: "Experience premium financial trading simulation with real-time market data and sophisticated analytics",
};

export const viewport: Viewport = {
  themeColor: "#FEF9E6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${cedarville.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-softBrown">
        {children}
        {/* 可选：微妙的噪点纹理 */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('/noise.png')] mix-blend-multiply" />
      </body>
    </html>
  );
}
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
    scrollToEnter: '向下滑动，进入市场',
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
    scrollToEnter: 'Scroll down to enter',
  }
};

// -------------------- 资产数据（15只股票）--------------------
const ASSETS = [
  { id: 'SPY', name: 'S&P 500', zone: '北美', price: 512.45, color: 'bg-[#D4C4A8]' },
  { id: 'QQQ', name: 'Nasdaq 100', zone: '北美', price: 445.2, color: 'bg-[#C7B48A]' },
  { id: 'AAPL', name: 'Apple Inc.', zone: '北美', price: 175.30, color: 'bg-[#D4C4A8]' },
  { id: 'MSFT', name: 'Microsoft', zone: '北美', price: 420.80, color: 'bg-[#D4C4A8]' },
  { id: 'GOOGL', name: 'Alphabet', zone: '北美', price: 150.25, color: 'bg-[#D4C4A8]' },
  { id: 'TSLA', name: 'Tesla', zone: '北美', price: 175.60, color: 'bg-[#D4C4A8]' },
  { id: 'HSI', name: 'Hang Seng', zone: '亚洲', price: 16500, color: 'bg-[#E2C7A0]' },
  { id: 'N225', name: 'Nikkei 225', zone: '亚洲', price: 38500, color: 'bg-[#E2C7A0]' },
  { id: 'SSE', name: 'Shanghai Comp', zone: '亚洲', price: 3100, color: 'bg-[#E2C7A0]' },
  { id: 'DAX', name: 'DAX', zone: '欧洲', price: 17850, color: 'bg-[#B8A67C]' },
  { id: 'UKX', name: 'FTSE 100', zone: '欧洲', price: 7900, color: 'bg-[#B8A67C]' },
  { id: 'CAC', name: 'CAC 40', zone: '欧洲', price: 7600, color: 'bg-[#B8A67C]' },
  { id: 'BABA', name: 'Alibaba', zone: '亚洲', price: 75.40, color: 'bg-[#E2C7A0]' },
  { id: 'NVDA', name: 'NVIDIA', zone: '北美', price: 900.10, color: 'bg-[#D4C4A8]' },
  { id: 'AMD', name: 'AMD', zone: '北美', price: 150.20, color: 'bg-[#D4C4A8]' },
];

const FOOD_COLLECTION = [
  { icon: '🍵', name: '翠玉抹茶', desc: '心平气和，方能看透红绿', color: 'bg-[#E8F0E5]' },
  { icon: '🍇', name: '多肉葡萄', desc: '丰收时刻，持仓大吉', color: 'bg-[#F7E8F0]' },
  { icon: '🥐', name: '巧克力可颂', desc: '外酥里嫩，盈利爆浆', color: 'bg-[#FCF4E3]' },
  { icon: '🍓', name: '芝芝莓莓', desc: '甜美收益，生活微甜', color: 'bg-[#FEE9E9]' },
  { icon: '🥑', name: '能量牛油果', desc: '健康持仓，长线是金', color: 'bg-[#F0F7E6]' },
  { icon: '🍰', name: '云朵千层', desc: '轻盈获利，拒绝焦虑', color: 'bg-[#FDE6F0]' }
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

export default function Home() {
  const [lang, setLang] = useState<Language>('zh');
  const t = (key: keyof typeof translations.zh) => (translations[lang] as any)[key] || key;

  // 核心状态
  const [balance, setBalance] = useState(1000000);
  const [shares, setShares] = useState<Record<string, number>>({});
  const [prices, setPrices] = useState(ASSETS);
  const [activeId, setActiveId] = useState('SPY');
  const [amt, setAmt] = useState('');
  const [exp, setExp] = useState(0);
  const [unlockedFoods, setUnlockedFoods] = useState<typeof FOOD_COLLECTION>([]);
  const [currentProgress, setCurrentProgress] = useState(0);

  // 页面路由
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'payment'>('home');
  const [user, setUser] = useState<{ username: string; wechatBound: boolean } | null>(null);

  // 图表相关
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

  useEffect(() => {
    setStaticChartData(generateStaticCandlestickData(activeAsset.price));
  }, [activeAsset.id]);

  const [searchTerm, setSearchTerm] = useState('');
  const filteredAssets = useMemo(() => {
    if (!searchTerm.trim()) return prices;
    const lower = searchTerm.toLowerCase();
    return prices.filter(a => a.id.toLowerCase().includes(lower) || a.name.toLowerCase().includes(lower));
  }, [prices, searchTerm]);

  // 新闻相关
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
  const paginatedNews = useMemo(() => filteredNews.slice(0, newsPage * NEWS_PER_PAGE), [filteredNews, newsPage]);

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

  // 每日更新新闻
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

  // 定时更新价格
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

  const getCurrentLevel = (exp: number, lang: Language) => {
    const level = LEVELS.filter(l => l.threshold <= exp).slice(-1)[0];
    return lang === 'zh' ? level.zh : level.en;
  };

  // K线图初始化
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: '#FFFCF0' },
        textColor: '#2C2A24',
      },
      grid: {
        vertLines: { color: '#E8E0D0' },
        horzLines: { color: '#E8E0D0' },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: '#E8E0D0' },
      timeScale: { borderColor: '#E8E0D0', timeVisible: true, secondsVisible: false },
    });
    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#9BAB7C',
      downColor: '#D9B48B',
      borderVisible: false,
      wickUpColor: '#9BAB7C',
      wickDownColor: '#D9B48B',
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

  // Splash 滚动控制
  const [splashOpacity, setSplashOpacity] = useState(1);
  const [splashVisible, setSplashVisible] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 400;
      const opacity = Math.max(0, 1 - scrollY / maxScroll);
      setSplashOpacity(opacity);
      if (opacity === 0) setSplashVisible(false);
      else setSplashVisible(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 辅助函数：滚动到主内容
  const scrollToMain = () => {
    const mainEl = document.getElementById('main-content');
    if (mainEl) mainEl.scrollIntoView({ behavior: 'smooth' });
  };

  // 登录/支付页面（简化，保留原有结构但统一色调）
  const renderLoginPage = () => (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <div className="w-full max-w-md p-8 bg-white/80 rounded-2xl shadow-xl backdrop-blur-sm border border-accent/20">
        <h2 className="text-2xl font-serif text-center mb-6">{isLogin ? t('login') : t('register')}</h2>
        {/* 表单内容与原相同，仅背景和边框微调 */}
        {isLogin ? (
          <>
            <input type="text" placeholder={t('username')} className="w-full p-3 mb-4 border rounded-lg bg-white/80" value={loginForm.username} onChange={e => setLoginForm({ ...loginForm, username: e.target.value })} />
            <input type="password" placeholder={t('password')} className="w-full p-3 mb-6 border rounded-lg bg-white/80" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
            <button onClick={handleLogin} className="w-full py-3 bg-accent hover:bg-accentDark text-white rounded-lg font-bold transition">{t('loginBtn')}</button>
            <p className="text-center mt-4 text-sm">没有账号？ <button onClick={() => setIsLogin(false)} className="text-accent underline">注册</button></p>
          </>
        ) : (
          <>
            <input type="text" placeholder={t('username')} className="w-full p-3 mb-4 border rounded-lg bg-white/80" value={registerForm.username} onChange={e => setRegisterForm({ ...registerForm, username: e.target.value })} />
            <input type="email" placeholder={t('email')} className="w-full p-3 mb-4 border rounded-lg bg-white/80" value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} />
            <input type="tel" placeholder={t('phone')} className="w-full p-3 mb-4 border rounded-lg bg-white/80" value={registerForm.phone} onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })} />
            <input type="password" placeholder={t('password')} className="w-full p-3 mb-4 border rounded-lg bg-white/80" value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} />
            <input type="password" placeholder={t('confirmPassword')} className="w-full p-3 mb-4 border rounded-lg bg-white/80" value={registerForm.confirm} onChange={e => setRegisterForm({ ...registerForm, confirm: e.target.value })} />
            <div className="flex items-center mb-4">
              <span className="mr-2">{t('bindWechat')}</span>
              <input type="text" placeholder={t('wechatPlaceholder')} className="flex-1 p-3 border rounded-lg bg-white/80" value={registerForm.wechat} onChange={e => setRegisterForm({ ...registerForm, wechat: e.target.value })} />
            </div>
            <button onClick={handleRegister} className="w-full py-3 bg-accent hover:bg-accentDark text-white rounded-lg font-bold transition">{t('registerBtn')}</button>
            <p className="text-center mt-4 text-sm">已有账号？ <button onClick={() => setIsLogin(true)} className="text-accent underline">登录</button></p>
          </>
        )}
      </div>
    </div>
  );

  const renderPaymentPage = () => (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <div className="w-full max-w-md p-8 bg-white/80 rounded-2xl shadow-xl backdrop-blur-sm border border-accent/20">
        <h2 className="text-2xl font-serif text-center mb-6">{t('selectDrink')}</h2>
        <div className="space-y-4 mb-6">
          {Object.entries(drinkNames).map(([key, name]) => (
            <label key={key} className="flex items-center p-3 border rounded-lg cursor-pointer bg-white/60">
              <input type="radio" name="drink" value={key} checked={selectedDrink === key} onChange={() => setSelectedDrink(key as any)} className="mr-3 accent-accent" />
              <span className="flex-1">{name}</span>
              <span>¥{drinkPrices[key as keyof typeof drinkPrices]}</span>
            </label>
          ))}
        </div>
        <div className="mb-6">
          <p className="font-bold mb-2">{t('paymentMethod')}</p>
          <div className="flex gap-4">
            <button onClick={() => setPaymentMethod('wechat')} className={`flex-1 py-2 rounded-lg border ${paymentMethod === 'wechat' ? 'border-accent bg-accent/10' : 'bg-white/60'}`}>微信</button>
            <button onClick={() => setPaymentMethod('alipay')} className={`flex-1 py-2 rounded-lg border ${paymentMethod === 'alipay' ? 'border-accent bg-accent/10' : 'bg-white/60'}`}>支付宝</button>
            <button onClick={() => setPaymentMethod('visa')} className={`flex-1 py-2 rounded-lg border ${paymentMethod === 'visa' ? 'border-accent bg-accent/10' : 'bg-white/60'}`}>Visa</button>
          </div>
        </div>
        <button onClick={handlePayment} className="w-full py-3 bg-accent hover:bg-accentDark text-white rounded-lg font-bold transition">{t('pay')}</button>
        <button onClick={() => setCurrentPage('home')} className="w-full mt-3 py-2 text-gray-500 underline">返回</button>
      </div>
    </div>
  );

  // 主页面（新设计）
  const renderHome = () => (
    <div className="relative min-h-screen bg-cream">
      {/* Splash 艺术层 */}
      {splashVisible && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700 pointer-events-none"
          style={{ opacity: splashOpacity, background: '#FEF9E6' }}
        >
          <div className="text-center max-w-2xl px-6 animate-fade-up">
            {/* 手绘风格装饰图形 */}
            <div className="mb-8 relative">
              <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-accent">
                <path d="M100 30 L120 70 L100 110 L80 70 Z" fill="#C7B48A" stroke="#A28F64" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="100" cy="100" r="30" stroke="#C7B48A" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                <path d="M60 140 L140 140 L100 180 Z" fill="#E2C7A0" stroke="#A28F64" strokeWidth="1.5" />
                <path d="M70 70 L130 70" stroke="#C7B48A" strokeWidth="2" strokeLinecap="round" />
                <path d="M70 130 L130 130" stroke="#C7B48A" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-4 tracking-wide" style={{ fontFamily: 'var(--font-playfair)' }}>
              {lang === 'zh' ? '半两·资本' : 'Banliang Capital'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-cursive text-accentDark">
              {lang === 'zh' ? '在波动中寻觅恒久价值' : 'Seeking lasting value amidst volatility'}
            </p>
            <button
              onClick={scrollToMain}
              className="mt-8 px-8 py-3 rounded-full border-2 border-accent text-accent hover:bg-accent hover:text-white transition-all duration-300 font-cursive text-lg inline-flex items-center gap-2"
            >
              {t('scrollToEnter')}
              <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7m14-6l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 主交易平台 */}
      <div id="main-content" className="relative z-10">
        <header className="sticky top-0 z-20 bg-cream/80 backdrop-blur-md border-b border-warmGray">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-serif text-xl">半</span>
              </div>
              <h1 className="font-serif text-xl tracking-tight">BANLIANG GLOBAL</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLang('zh')}
                className={`px-3 py-1 rounded-full transition ${lang === 'zh' ? 'bg-accent text-white' : 'text-textSoft hover:bg-warmGray'}`}
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                中文
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full transition ${lang === 'en' ? 'bg-accent text-white' : 'text-textSoft hover:bg-warmGray'}`}
                style={{ fontFamily: 'var(--font-cedarville)' }}
              >
                EN
              </button>
              <button
                onClick={() => setShowHistoryModal(true)}
                className="px-4 py-1 rounded-full text-sm bg-accent/20 hover:bg-accent/30 transition flex items-center gap-1"
              >
                📊 {t('tradeHistory')}
              </button>
            </div>

            <div className="flex items-center gap-4 bg-warmGray/60 rounded-full px-4 py-2">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-textSoft">{t('nextReward')}</p>
                <p className="text-xs font-bold text-accent">{t('snackIncubating')}</p>
              </div>
              <div className="w-24 h-2 bg-cream rounded-full overflow-hidden">
                <div className="h-full bg-accent transition-all duration-700" style={{ width: `${currentProgress}%` }} />
              </div>
              <span className="text-xl">{currentProgress > 80 ? '🎁' : '🥣'}</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-textSoft">{t('netWorth')}</p>
                <p className="font-mono font-bold text-lg text-accentDark">${(balance + totalEquity).toLocaleString()}</p>
              </div>
              {user && (
                <button onClick={() => setCurrentPage('login')} className="text-sm px-3 py-1 rounded-full bg-accent/20 hover:bg-accent/30 transition">
                  {user.username}
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 左侧市场列表 */}
            <aside className="lg:w-72 space-y-6">
              <div>
                <input
                  type="text"
                  placeholder={t('searchStock')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-full border border-warmGray bg-white/60 focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-textSoft">{t('liveMarket')}</p>
              <div className="space-y-2">
                {filteredAssets.map(a => (
                  <div
                    key={a.id}
                    onClick={() => setActiveId(a.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 hover:translate-x-1 ${
                      activeId === a.id
                        ? 'bg-accent text-white shadow-md'
                        : 'bg-white/60 hover:bg-warmGray border border-warmGray'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm">{a.id}</span>
                      <span className="w-2 h-2 rounded-full bg-white/50" />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="opacity-80">{a.name}</span>
                      <span className="font-mono">${a.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-5 rounded-3xl bg-warmGray/60 cursor-pointer text-center" onClick={() => setShowPaymentModal(true)}>
                <div className="text-3xl mb-2">🍵</div>
                <p className="text-sm font-serif">{t('buyTea')}</p>
                <p className="text-[10px] opacity-60 mt-1">{t('supportDesc')}</p>
                <button className="mt-2 text-xs font-bold px-4 py-1 rounded-full bg-white/80 hover:bg-white transition">{t('treat')}</button>
              </div>
            </aside>

            {/* 中央主内容 */}
            <main className="flex-1">
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-sm text-textSoft uppercase">{activeAsset.zone} · {activeAsset.name}</p>
                    <h2 className="text-5xl font-mono tracking-tight">${activeAsset.price.toLocaleString()}</h2>
                  </div>
                  <div>
                    <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">● LIVE</span>
                  </div>
                </div>

                <div className="mb-8 bg-white/40 rounded-2xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                    <h3 className="font-serif text-lg">{t('priceChart')}</h3>
                    <div className="flex gap-2 text-xs">
                      {(['1m', '10m', '1h', '1d', '1mo', '1y'] as const).map(range => (
                        <button
                          key={range}
                          onClick={() => setChartRange(range)}
                          className={`px-2 py-1 rounded-full transition ${chartRange === range ? 'bg-accent text-white' : 'bg-warmGray/50 hover:bg-warmGray'}`}
                        >
                          {t(range)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div ref={chartContainerRef} style={{ width: '100%', height: 300 }} />
                  <p className="text-xs text-center text-textSoft mt-2">鼠标滚轮缩放，拖拽查看历史K线</p>
                </div>

                <div className="bg-white/60 rounded-3xl p-6 shadow-sm mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-textSoft">{t('quantity')}</label>
                      <input
                        type="number"
                        value={amt}
                        onChange={e => setAmt(e.target.value)}
                        placeholder="0.00"
                        className="w-full text-3xl font-light bg-transparent border-b border-accent/30 focus:border-accent outline-none pb-1"
                      />
                      <p className="mt-2 text-xs text-textSoft">{t('estimated')} ${((parseFloat(amt) || 0) * activeAsset.price).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <button onClick={() => trade('buy')} className="w-full py-3 bg-accent hover:bg-accentDark text-white rounded-2xl font-bold text-lg shadow-sm transition active:scale-95">
                        {t('buy')}
                      </button>
                      <button onClick={() => trade('sell')} className="w-full py-3 border-2 border-accent rounded-2xl font-bold text-accent hover:bg-accent hover:text-white transition">
                        {t('sell')}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/60 rounded-2xl p-4 text-center">
                    <p className="text-[10px] uppercase text-textSoft">{t('cash')}</p>
                    <p className="font-mono text-xl">${balance.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/60 rounded-2xl p-4 text-center">
                    <p className="text-[10px] uppercase text-textSoft">{t('equity')}</p>
                    <p className="font-mono text-xl text-accent">${totalEquity.toLocaleString()}</p>
                  </div>
                  <div className="bg-accent/10 rounded-2xl p-4 text-center cursor-pointer hover:bg-accent/20 transition" onClick={() => setShowLevelModal(true)}>
                    <p className="text-[10px] uppercase text-accent">{t('level')}</p>
                    <p className="font-mono text-xl font-bold">{getCurrentLevel(exp, lang)}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-[10px] uppercase tracking-wider text-center text-textSoft mb-2">{t('portfolio')}</p>
                  <div className="flex h-2 w-full rounded-full overflow-hidden bg-warmGray">
                    {prices.map(a => {
                      const qty = shares[a.id] || 0;
                      const weight = totalEquity > 0 ? (qty * a.price) / totalEquity * 100 : 0;
                      return <div key={a.id} className={`h-full ${a.color}`} style={{ width: `${weight}%` }} title={`${a.id}: ${weight.toFixed(1)}%`} />;
                    })}
                  </div>
                  {totalEquity === 0 && <p className="text-[10px] text-center mt-2 text-textSoft">{t('noPosition')}</p>}
                </div>

                {unlockedFoods.length > 0 && (
                  <div className="mt-8">
                    <p className="text-[10px] uppercase tracking-wider text-center text-textSoft mb-3">{t('foodGallery')}</p>
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

            {/* 右侧深度情报 */}
            <aside className="lg:w-80 space-y-6">
              <div>
                <input
                  type="text"
                  placeholder={t('searchNews')}
                  value={newsSearchTerm}
                  onChange={(e) => setNewsSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-full border border-warmGray bg-white/60 focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-textSoft">{t('intelligence')}</p>
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {paginatedNews.map(n => (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNews(n)}
                    className="bg-white/60 rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md border border-warmGray"
                  >
                    {n.imageUrl && (
                      <img src={n.imageUrl} alt="news" className="w-full h-28 object-cover rounded-xl mb-3" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${n.impact === 'positive' ? 'bg-accent/20 text-accentDark' : n.impact === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                        {lang === 'zh' ? n.tag : n.tagEn}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold mt-1 line-clamp-2 font-serif">{lang === 'zh' ? n.title : n.titleEn}</h4>
                    <p className="text-xs text-textSoft mt-1 line-clamp-2">{lang === 'zh' ? n.body : n.bodyEn}</p>
                  </div>
                ))}
                <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
                  {paginatedNews.length < filteredNews.length && (
                    <span className="text-xs text-accent animate-pulse">加载更多...</span>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* 模态框（等级、支付、历史、新闻详情）—— 仅保留结构，样式适配新色调 */}
      {showLevelModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowLevelModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-serif mb-4">{t('levelTitle')}</h2>
            <div className="space-y-4">
              {LEVELS.map((level, idx) => {
                const isCurrent = exp >= level.threshold && (idx === LEVELS.length - 1 || exp < LEVELS[idx + 1].threshold);
                const isLocked = exp < level.threshold;
                return (
                  <div key={idx} className={`p-4 rounded-xl border ${isCurrent ? 'bg-accent/10 border-accent' : isLocked ? 'opacity-40' : ''}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold">{lang === 'zh' ? level.zh : level.en}</h3>
                      <span className="text-xs text-textSoft">{level.threshold} {t('expRequired')}</span>
                    </div>
                    <p className="text-xs mt-1">{lang === 'zh' ? `达到 ${level.threshold} 经验解锁` : `Reach ${level.threshold} EXP to unlock`}</p>
                    {isCurrent && <p className="text-xs text-accent mt-2">{t('currentLevel')}</p>}
                    {!isCurrent && !isLocked && idx < LEVELS.length - 1 && (
                      <p className="text-xs mt-2">{t('nextLevelExp')} {LEVELS[idx + 1].threshold - exp} {t('expRequired')}</p>
                    )}
                  </div>
                );
              })}
            </div>
            <button onClick={() => setShowLevelModal(false)} className="mt-6 w-full py-2 bg-warmGray rounded-lg">关闭</button>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-serif mb-4">{t('selectDrink')}</h2>
            <div className="space-y-4 mb-6">
              {Object.entries(drinkNames).map(([key, name]) => (
                <label key={key} className="flex items-center p-3 border rounded-lg cursor-pointer bg-warmGray/30">
                  <input type="radio" name="drink" value={key} checked={selectedDrink === key} onChange={() => setSelectedDrink(key as any)} className="mr-3 accent-accent" />
                  <span className="flex-1">{name}</span>
                  <span>¥{drinkPrices[key as keyof typeof drinkPrices]}</span>
                </label>
              ))}
            </div>
            <div className="mb-6">
              <p className="font-bold mb-2">{t('paymentMethod')}</p>
              <div className="flex gap-4">
                <button onClick={() => setPaymentMethod('wechat')} className={`flex-1 py-2 rounded-lg border ${paymentMethod === 'wechat' ? 'border-accent bg-accent/10' : 'bg-warmGray/30'}`}>微信</button>
                <button onClick={() => setPaymentMethod('alipay')} className={`flex-1 py-2 rounded-lg border ${paymentMethod === 'alipay' ? 'border-accent bg-accent/10' : 'bg-warmGray/30'}`}>支付宝</button>
                <button onClick={() => setPaymentMethod('visa')} className={`flex-1 py-2 rounded-lg border ${paymentMethod === 'visa' ? 'border-accent bg-accent/10' : 'bg-warmGray/30'}`}>Visa</button>
              </div>
            </div>
            <button onClick={handlePayment} className="w-full py-3 bg-accent hover:bg-accentDark text-white rounded-lg font-bold transition">{t('pay')}</button>
            <button onClick={() => setShowPaymentModal(false)} className="w-full mt-3 py-2 text-gray-500 underline">取消</button>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowHistoryModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-serif mb-4">{t('tradeHistory')}</h2>
            {tradeHistory.length === 0 ? (
              <p className="text-center text-textSoft">{t('noHistory')}</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-warmGray">
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
            <button onClick={() => setShowHistoryModal(false)} className="mt-6 w-full py-2 bg-warmGray rounded-lg">关闭</button>
          </div>
        </div>
      )}

      {selectedNews && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setSelectedNews(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-serif mb-2">{lang === 'zh' ? selectedNews.title : selectedNews.titleEn}</h2>
            <div className="flex gap-4 text-xs text-textSoft mb-4">
              <span>{lang === 'zh' ? selectedNews.source : selectedNews.sourceEn}</span>
              <span>{lang === 'zh' ? selectedNews.date : selectedNews.dateEn}</span>
            </div>
            {selectedNews.imageUrl && (
              <img src={selectedNews.imageUrl} alt="" className="w-full h-48 object-cover rounded-lg mb-4" />
            )}
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {lang === 'zh' ? selectedNews.fullContent : selectedNews.fullContentEn}
            </p>
            <button onClick={() => setSelectedNews(null)} className="mt-6 w-full py-2 bg-warmGray rounded-lg">{t('backToList')}</button>
          </div>
        </div>
      )}
    </div>
  );

  if (currentPage === 'login') return renderLoginPage();
  if (currentPage === 'payment') return renderPaymentPage();
  return renderHome();
}