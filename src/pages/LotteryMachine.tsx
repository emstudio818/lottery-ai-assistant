import { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, Play, Sparkles } from 'lucide-react';

export default function LotteryMachine() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [numbers, setNumbers] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [specialNumber, setSpecialNumber] = useState(0);
  const [finalNumbers, setFinalNumbers] = useState<number[]>([]);
  const [finalSpecial, setFinalSpecial] = useState(0);
  const [stage, setStage] = useState(0); // 0: 準備, 1-6: 產生號碼, 7: 完成
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const generateRandomNumber = (existing: number[]): number => {
    let num: number;
    do {
      num = Math.floor(Math.random() * 49) + 1;
    } while (existing.includes(num));
    return num;
  };
  
  const startSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setStage(1);
    setFinalNumbers([]);
    setFinalSpecial(0);
    
    let currentStage = 1;
    const tempNumbers: number[] = [];
    
    // 開始快速變換號碼
    intervalRef.current = setInterval(() => {
      const newNumbers = [...numbers];
      for (let i = 0; i < 6; i++) {
        if (i < currentStage - 1) {
          continue; // 已確定的號碼保持不變
        }
        newNumbers[i] = Math.floor(Math.random() * 49) + 1;
      }
      setNumbers(newNumbers);
      setSpecialNumber(Math.floor(Math.random() * 49) + 1);
    }, 50);
    
    // 逐步確定每個號碼
    const stageInterval = setInterval(() => {
      if (currentStage <= 6) {
        const newNum = generateRandomNumber(tempNumbers);
        tempNumbers.push(newNum);
        setFinalNumbers([...tempNumbers]);
        setStage(currentStage + 1);
        
        // 更新該位置顯示最終號碼
        setNumbers(prev => {
          const newNums = [...prev];
          newNums[currentStage - 1] = newNum;
          return newNums;
        });
        
        if (currentStage === 6) {
          // 最後確定特別號
          setTimeout(() => {
            const specialNum = generateRandomNumber(tempNumbers);
            setFinalSpecial(specialNum);
            setSpecialNumber(specialNum);
            setStage(7);
            setIsSpinning(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            clearInterval(stageInterval);
          }, 1000);
        }
        currentStage++;
      }
    }, 1500);
  };
  
  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsSpinning(false);
    setNumbers([0, 0, 0, 0, 0, 0]);
    setSpecialNumber(0);
    setFinalNumbers([]);
    setFinalSpecial(0);
    setStage(0);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="text-gold-400" size={32} />
        <div>
          <h1 className="text-3xl font-bold text-white">搖獎機</h1>
          <p className="text-gray-400">手動模擬大樂透開獎</p>
        </div>
      </div>
      
      <div className="card">
        {/* 搖獎機顯示區 */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            {/* 搖獎機外觀 */}
            <div className="w-80 h-80 rounded-full bg-gradient-to-br from-gray-800 via-gray-900 to-black border-4 border-gray-700 shadow-2xl flex items-center justify-center relative overflow-hidden">
              {/* 閃光效果 */}
              {isSpinning && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent animate-pulse" />
                </>
              )}
              
              {/* 中心顯示 */}
              <div className="text-center z-10">
                <Sparkles className={`mx-auto mb-4 ${isSpinning ? 'text-yellow-400 animate-spin' : 'text-gray-600'}`} size={48} />
                <div className="text-xl font-bold text-white">
                  {stage === 0 && '準備就緒'}
                  {stage >= 1 && stage <= 6 && `產生第 ${stage} 個號碼...`}
                  {stage === 7 && '開獎完成！'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 號碼顯示區 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 text-center">開獎號碼</h2>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {numbers.map((num, idx) => (
              <div
                key={idx}
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-4
                  transition-all duration-300
                  ${idx < finalNumbers.length 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-400 text-white scale-110 shadow-lg shadow-blue-500/50' 
                    : isSpinning 
                      ? 'bg-gray-800 border-gray-600 text-gray-300 animate-bounce' 
                      : 'bg-gray-800 border-gray-700 text-gray-500'
                  }
                `}
              >
                {num || '-'}
              </div>
            ))}
            
            <div className="w-8 flex items-center justify-center text-gray-500 font-bold text-xl">+</div>
            
            <div
              className={`
                w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-4
                transition-all duration-300
                ${finalSpecial 
                  ? 'bg-gradient-to-br from-yellow-500 to-gold-600 border-yellow-400 text-white scale-110 shadow-lg shadow-gold-500/50' 
                  : isSpinning 
                    ? 'bg-gray-800 border-gray-600 text-gray-300 animate-bounce' 
                    : 'bg-gray-800 border-gray-700 text-gray-500'
                }
              `}
            >
              {specialNumber || '-'}
            </div>
          </div>
          <div className="text-center text-gray-400 mt-2">
            <span className="text-blue-400 font-semibold">一般號碼</span>
            {' + '}
            <span className="text-gold-400 font-semibold">特別號</span>
          </div>
        </div>
        
        {/* 操作按鈕 */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={startSpin}
            disabled={isSpinning}
            className={`
              flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all
              ${isSpinning 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-600 to-green-800 text-white hover:from-green-700 hover:to-green-900 shadow-lg hover:shadow-green-500/50 active:scale-95'
              }
            `}
          >
            <Play size={24} />
            {isSpinning ? '開獎中...' : '開始搖獎'}
          </button>
          
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-lg bg-gray-700 text-white hover:bg-gray-600 transition-all shadow-lg active:scale-95"
          >
            <RotateCcw size={24} />
            重置
          </button>
        </div>
        
        {/* 歷史記錄（這次的結果） */}
        {stage === 7 && (
          <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">本次開獎結果</h3>
            <div className="flex items-center justify-center gap-2">
              {[...finalNumbers].sort((a, b) => a - b).map((num, idx) => (
                <div key={idx} className="number-ball-blue">
                  {num}
                </div>
              ))}
              <div className="w-8 flex items-center justify-center text-gray-500 font-bold">+</div>
              <div className="number-ball-gold">{finalSpecial}</div>
            </div>
          </div>
        )}
      </div>
      
      {/* 使用說明 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-3">使用說明</h3>
        <ul className="text-gray-400 space-y-2">
          <li>• 點擊「開始搖獎」按鈕開始模擬開獎</li>
          <li>• 號碼會一個一個逐漸確定，增加緊張感</li>
          <li>• 前六個是一般號碼，最後一個是特別號</li>
          <li>• 點擊「重置」按鈕可以重新開始</li>
          <li>• 所有號碼都是隨機生成，僅供娛樂</li>
        </ul>
      </div>
    </div>
  );
}
