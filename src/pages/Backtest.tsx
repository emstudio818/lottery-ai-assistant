import { useLotteryData } from '../lib/useLotteryData';
import { BarChart3, CheckCircle2, XCircle, Target } from 'lucide-react';

export default function Backtest() {
  const { backtestResults } = useLotteryData();
  const wins = backtestResults.filter(r => r.won).length;
  const total = backtestResults.length;
  const winRate = (wins / total * 100).toFixed(1);
  const avgMatches = (backtestResults.reduce((sum, r) => sum + r.matches, 0) / total).toFixed(1);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-2 md:gap-3">
        <BarChart3 className="text-gold-400 w-6 h-6 md:w-8 md:h-8" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">回測分析</h1>
          <p className="text-sm md:text-base text-gray-400">AI 模型歷史測試結果</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        <div className="card text-center">
          <div className="text-2xl md:text-4xl font-bold text-gold-400 mb-2">{winRate}%</div>
          <div className="text-sm md:text-base text-gray-400">中獎率</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl md:text-4xl font-bold text-blue-400 mb-2">{wins}/{total}</div>
          <div className="text-sm md:text-base text-gray-400">中獎次數</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl md:text-4xl font-bold text-gold-400 mb-2">{avgMatches}</div>
          <div className="text-sm md:text-base text-gray-400">平均命中數</div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
          <Target className="text-blue-400 w-5 h-5 md:w-6 md:h-6" />
          詳細測試記錄
        </h2>
        <div className="space-y-3 md:space-y-4">
          {backtestResults.map((result) => (
            <div
              key={result.id}
              className="bg-gray-800 rounded-lg p-3 md:p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2 md:mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="text-gold-400 font-semibold text-sm md:text-base">期別: {result.period}</span>
                  {result.won ? (
                    <span className="flex items-center gap-1 text-green-400 text-sm md:text-base">
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                      中獎
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 text-sm md:text-base">
                      <XCircle className="w-4 h-4 md:w-5 md:h-5" />
                      未中
                    </span>
                  )}
                </div>
                <span className="text-blue-400 font-semibold text-sm md:text-base">
                  命中 {result.matches} 號
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <div className="text-xs md:text-sm text-gray-400 mb-2">AI 推薦</div>
                  <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                    {result.recommendedNumbers.map((num, idx) => (
                      <div
                        key={idx}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-transform hover:scale-110 ${
                          result.actualNumbers.includes(num)
                            ? 'bg-gradient-to-br from-yellow-500 to-gold-600 text-white shadow-lg shadow-gold-500/30'
                            : 'bg-gradient-to-br from-gray-600 to-gray-800 text-gray-300'
                        }`}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs md:text-sm text-gray-400 mb-2">實際開獎</div>
                  <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                    {result.actualNumbers.map((num, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
