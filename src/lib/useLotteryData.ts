import { useState, useEffect } from 'react';
import { 
  LotteryResult, 
  NumberFrequency, 
  AIRecommendation, 
  BacktestResult,
  Cooccurrence,
  lotteryResults as initialLotteryResults,
  numberFrequencies as initialNumberFrequencies,
  aiRecommendations as initialAiRecommendations,
  backtestResults as initialBacktestResults,
  cooccurrences as initialCooccurrences
} from './mockData';

// 從 localStorage 加載數據，或者使用初始數據
const loadFromStorage = <T>(key: string, initialData: T): T => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved data:', e);
      }
    }
  }
  return initialData;
};

// 保存數據到 localStorage
const saveToStorage = <T>(key: string, data: T) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// 重新計算所有分析數據的函數（複製自 mockData 但保持獨立）
const generateRandomNumbers = (): number[] => {
  const numbers: number[] = [];
  while (numbers.length < 6) {
    const num = Math.floor(Math.random() * 49) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers.sort((a, b) => a - b);
};

const analyzeNumbers = (data: LotteryResult[]): NumberFrequency[] => {
  const frequencyMap = new Map<number, { count: number; lastSeen: number }>();
  
  for (let i = 1; i <= 49; i++) {
    frequencyMap.set(i, { count: 0, lastSeen: data.length });
  }
  
  data.forEach((draw, index) => {
    // index 0: 最新的一期 → 距離現在0期
    // index 1: 前一期 → 距離現在1期
    // 依此類推
    draw.numbers.forEach(num => {
      const current = frequencyMap.get(num)!;
      current.count++;
      // 只記錄第一次遇到的（也就是最近的一次）
      if (current.lastSeen === data.length) {
        current.lastSeen = index;
      }
    });
  });
  
  const avgCount = (data.length * 6) / 49;
  
  return Array.from({ length: 49 }, (_, i) => {
    const number = i + 1;
    const { count, lastSeen } = frequencyMap.get(number)!;
    const probability = count / data.length;
    const missingRounds = lastSeen;
    
    let hotness: 'hot' | 'cold' | 'neutral';
    if (count > avgCount * 1.2 && lastSeen < 10) {
      hotness = 'hot';
    } else if (count < avgCount * 0.8 && lastSeen > 20) {
      hotness = 'cold';
    } else {
      hotness = 'neutral';
    }
    
    let bonus = 10;
    if (hotness === 'hot') {
      bonus = 30;
    } else if (hotness === 'cold') {
      bonus = 10;
    }
    
    // 限制 lastSeen 的最大值，避免分數出現負數
    const normalizedLastSeen = Math.min(lastSeen, 50);
    
    const aiScore = Math.max(0, Math.min(100, 
      (count / avgCount * 40) + 
      (100 - normalizedLastSeen * 1.5) + bonus
    ));
    
    return {
      number,
      count,
      lastSeen,
      probability,
      hotness,
      missingRounds,
      aiScore
    };
  }).sort((a, b) => b.aiScore - a.aiScore);
};

const generateRecommendations = (_data: LotteryResult[], analysis: NumberFrequency[], count: number): AIRecommendation[] => {
  const recommendations: AIRecommendation[] = [];
  const strategies = [
    { name: '熱號策略', weight: 0.35 },
    { name: '冷熱交替', weight: 0.25 },
    { name: '區間均衡', weight: 0.2 },
    { name: '趨勢追蹤', weight: 0.15 },
    { name: '隨機優化', weight: 0.05 }
  ];
  
  for (let i = 0; i < count; i++) {
    const strategy = strategies[i % strategies.length];
    const hotNumbers = analysis.filter(n => n.hotness === 'hot').slice(0, 15).map(n => n.number);
    const coldNumbers = analysis.filter(n => n.hotness === 'cold').slice(0, 10).map(n => n.number);
    const neutralNumbers = analysis.filter(n => n.hotness === 'neutral').slice(0, 20).map(n => n.number);
    
    let pool: number[] = [];
    if (strategy.name === '熱號策略') {
      pool = [...hotNumbers, ...neutralNumbers.slice(0, 10)];
    } else if (strategy.name === '冷熱交替') {
      pool = [...hotNumbers.slice(0, 10), ...coldNumbers];
    } else if (strategy.name === '區間均衡') {
      pool = [...analysis.filter(n => n.number <= 17 || n.number >= 33).map(n => n.number)];
    } else {
      pool = [...analysis.slice(0, 25).map(n => n.number)];
    }
    
    const numbers: number[] = [];
    while (numbers.length < 6) {
      const idx = Math.floor(Math.random() * pool.length);
      if (!numbers.includes(pool[idx])) {
        numbers.push(pool[idx]);
      }
    }
    
    numbers.sort((a, b) => a - b);
    
    const confidence = 0.7 + Math.random() * 0.25;
    const aiScore = Math.round(confidence * 100);
    
    recommendations.push({
      id: (i + 1).toString(),
      numbers,
      confidence,
      strategy: strategy.name,
      aiScore
    });
  }
  
  return recommendations;
};

const calculateMatches = (recommended: number[], actual: number[]): number => {
  return recommended.filter(num => actual.includes(num)).length;
};

const generateBacktestResults = (data: LotteryResult[], analysis: NumberFrequency[]): BacktestResult[] => {
  const backtestResults: BacktestResult[] = [];
  
  for (let i = 1; i < Math.min(data.length, 30); i++) {
    const currentResult = data[i];
    const mockRecommendations = generateRecommendations(
      data.slice(i), 
      analysis, 
      1
    );
    
    const recommended = mockRecommendations[0]?.numbers || generateRandomNumbers();
    const matches = calculateMatches(recommended, currentResult.numbers);
    const won = matches >= 3;
    
    backtestResults.push({
      id: i.toString(),
      period: currentResult.period,
      recommendedNumbers: recommended,
      actualNumbers: currentResult.numbers,
      matches,
      won
    });
  }
  
  return backtestResults;
};

const generateCooccurrences = (data: LotteryResult[]): Cooccurrence[] => {
  const cooccurrenceMap = new Map<string, number>();
  
  data.forEach(draw => {
    for (let i = 0; i < draw.numbers.length; i++) {
      for (let j = i + 1; j < draw.numbers.length; j++) {
        const key = [draw.numbers[i], draw.numbers[j]].sort((a, b) => a - b).join(',');
        cooccurrenceMap.set(key, (cooccurrenceMap.get(key) || 0) + 1);
      }
    }
  });
  
  return Array.from(cooccurrenceMap.entries())
    .map(([key, count]) => ({
      numbers: key.split(',').map(Number),
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
};

// 主要的數據管理 hook
export const useLotteryData = () => {
  // 使用 state 管理所有數據
  const [lotteryResults, setLotteryResults] = useState<LotteryResult[]>(() => 
    loadFromStorage('lotteryResults', initialLotteryResults)
  );
  const [numberFrequencies, setNumberFrequencies] = useState<NumberFrequency[]>(() => 
    loadFromStorage('numberFrequencies', initialNumberFrequencies)
  );
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>(() => 
    loadFromStorage('aiRecommendations', initialAiRecommendations)
  );
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>(() => 
    loadFromStorage('backtestResults', initialBacktestResults)
  );
  const [cooccurrences, setCooccurrences] = useState<Cooccurrence[]>(() => 
    loadFromStorage('cooccurrences', initialCooccurrences)
  );

  // 當開獎結果更新時，重新計算所有分析數據
  const recalculateAllData = (newResults: LotteryResult[]) => {
    const newFreq = analyzeNumbers(newResults);
    const newRecs = generateRecommendations(newResults, newFreq, 8);
    const newBacktest = generateBacktestResults(newResults, newFreq);
    const newCooccurrences = generateCooccurrences(newResults);
    
    setLotteryResults(newResults);
    setNumberFrequencies(newFreq);
    setAiRecommendations(newRecs);
    setBacktestResults(newBacktest);
    setCooccurrences(newCooccurrences);
    
    // 保存到 localStorage
    saveToStorage('lotteryResults', newResults);
    saveToStorage('numberFrequencies', newFreq);
    saveToStorage('aiRecommendations', newRecs);
    saveToStorage('backtestResults', newBacktest);
    saveToStorage('cooccurrences', newCooccurrences);
  };

  // 手動新增一期開獎結果
  const addNewResult = (
    period: string,
    date: string,
    numbers: number[],
    specialNumber: number
  ) => {
    const newResult: LotteryResult = {
      id: (lotteryResults.length + 1).toString(),
      period,
      date,
      numbers,
      specialNumber
    };
    
    const updatedResults = [newResult, ...lotteryResults];
    recalculateAllData(updatedResults);
  };

  // 重置為預設數據
  const resetToDefault = () => {
    recalculateAllData(initialLotteryResults);
  };

  // 初始化時如果 localStorage 是空的，就使用預設數據
  useEffect(() => {
    if (lotteryResults.length === 0) {
      recalculateAllData(initialLotteryResults);
    }
  }, []);

  return {
    lotteryResults,
    numberFrequencies,
    aiRecommendations,
    backtestResults,
    cooccurrences,
    addNewResult,
    resetToDefault
  };
};
