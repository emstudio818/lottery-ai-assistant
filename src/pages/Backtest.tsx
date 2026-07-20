import { useLotteryData } from '../lib/useLotteryData';
import { BarChart3, CheckCircle2, XCircle, Target } from 'lucide-react';

export default function Backtest() {
  const { backtestResults } = useLotteryData();
  const wins = backtestResults.filter(r => r.won).length;
  const total = backtestResults.length;
  const winRate = (wins / total * 100).toFixed(1);
  const avgMatches = (backtestResults.reduce((sum, r) => sum + r.matches, 0) / total).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="text-gold-400" size={32} />
        <div>
          <h1 className="text-3xl font-bold text-white">回測分析</h1>
          <p className="text-gray-400">AI 模型歷史測試結果</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-4xl font-bold text-gold-400 mb-2">{winRate}%</div>
          <div className="text-gray-400">中獎率</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-blue-400 mb-2">{wins}/{total}</div>
          <div className="text-gray-400">中獎次數</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-gold-400 mb-2">{avgMatches}</div>
          <div className="text-gray-400">平均命中數</div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="text-blue-400" size={24} />
          詳細測試記錄
        </h2>
        <div className="space-y-4">
          {backtestResults.map((result) => (
            <div
              key={result.id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <span className="text-gold-400 font-semibold">期別: {result.period}</span>
                  {result.won ? (
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircle2 size={18} />
                      中獎
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400">
                      <XCircle size={18} />
                      未中
                    </span>
                  )}
                </div>
                <span className="text-blue-400 font-semibold">
                  命中 {result.matches} 號
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-2">AI 推薦</div>
                  <div className="flex items-center gap-2">
                    {result.recommendedNumbers.map((num, idx) => (
                      <div
                        key={idx}
                        className={`number-ball ${
                          result.actualNumbers.includes(num)
                            ? 'number-ball-gold'
                            : 'number-ball-gray'
                        }`}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">實際開獎</div>
                  <div className="flex items-center gap-2">
                    {result.actualNumbers.map((num, idx) => (
                      <div
                        key={idx}
                        className="number-ball-blue"
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
