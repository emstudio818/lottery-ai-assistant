import { useLotteryData } from '../lib/useLotteryData';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Sparkles, TrendingUp, Calendar, Target, Zap, Activity, Clock, Users } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const { numberFrequencies, aiRecommendations, cooccurrences, lotteryResults } = useLotteryData();
  
  // 號碼頻率圖表數據 - 按出現次數降序排列
  const sortedByCount = [...numberFrequencies].sort((a, b) => b.count - a.count);
  const frequencyChartData = {
    labels: sortedByCount.slice(0, 15).map(nf => nf.number.toString()),
    datasets: [
      {
        label: '出現次數',
        data: sortedByCount.slice(0, 15).map(nf => nf.count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // 最近10期大小號比例趨勢圖表
  const recentTrendData = {
    labels: lotteryResults.slice(0, 10).reverse().map(r => r.period.slice(-3)),
    datasets: [
      {
        label: '小號 (1-24)',
        data: lotteryResults.slice(0, 10).reverse().map(r => 
          r.numbers.filter(num => num <= 24).length
        ),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: false,
      },
      {
        label: '大號 (25-49)',
        data: lotteryResults.slice(0, 10).reverse().map(r => 
          r.numbers.filter(num => num >= 25).length
        ),
        borderColor: 'rgba(234, 179, 8, 1)',
        backgroundColor: 'rgba(234, 179, 8, 0.2)',
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#9ca3af',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9ca3af',
        },
      },
    },
  };

  const recentTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#e5e7eb',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 6,
        ticks: {
          stepSize: 1,
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
      x: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
    },
  };

  const getHeatmapColor = (nf: any) => {
    if (nf.hotness === 'hot') {
      return 'bg-gradient-to-br from-red-600 to-red-700 text-white border-red-400';
    } else if (nf.hotness === 'cold') {
      return 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-400';
    }
    return 'bg-gray-800 text-gray-300 border-gray-700';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 頁頭 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
            <span className="bg-gradient-to-r from-blue-400 to-gold-400 bg-clip-text text-transparent">
              大樂透 AI 助手
            </span>
          </h1>
          <p className="text-sm md:text-base text-gray-400">智能分析，精準預測</p>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Calendar size={18} />
          <span>{new Date().toLocaleDateString('zh-TW')}</span>
        </div>
      </div>

      {/* AI 綜合評分 */}
      <div className="card">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <Sparkles className="text-gold-400 w-5 h-5 md:w-6 md:h-6" />
          <h2 className="text-lg md:text-xl font-semibold text-white">AI 綜合評分</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {numberFrequencies.slice(0, 4).map((nf) => (
            <div key={nf.number} className="bg-gray-800 rounded-lg p-3 md:p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-sm md:text-base">號碼 {nf.number}</span>
                <span className={`text-xl md:text-2xl font-bold ${getScoreColor(nf.aiScore)}`}>{nf.aiScore}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${nf.aiScore}%`,
                    background: nf.aiScore >= 80 ? 'linear-gradient(to right, #16a34a, #22c55e)' : 
                               nf.aiScore >= 60 ? 'linear-gradient(to right, #ca8a04, #eab308)' :
                               'linear-gradient(to right, #dc2626, #ef4444)'
                  }} 
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] md:text-xs text-gray-400">
                <span>機率: {(nf.probability * 100).toFixed(1)}%</span>
                <span>遺漏: {nf.missingRounds}期</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 49 球熱力圖 */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-gold-400 w-5 h-5 md:w-6 md:h-6" />
          <h2 className="text-xl font-semibold text-white">49 球熱力圖</h2>
        </div>
        
        {/* 熱力圖說明 */}
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-2">熱力圖說明</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• <span className="text-red-400 font-semibold">紅色</span>：熱門號碼 - 近期出現頻率高</li>
            <li>• <span className="text-blue-400 font-semibold">藍色</span>：冷門號碼 - 長期未出現</li>
            <li>• <span className="text-gray-400 font-semibold">灰色</span>：一般號碼 - 出現頻率適中</li>
            <li>• 每個格子顯示號碼和出現次數，幫助您快速識別熱門號碼</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-7 gap-2 md:gap-3 px-2 md:px-4">
          {numberFrequencies.map((nf) => (
            <div
              key={nf.number}
              className={`w-10 h-10 md:w-16 md:h-16 rounded-lg flex flex-col items-center justify-center font-bold transition-all hover:scale-105 hover:shadow-lg border-2 cursor-pointer ${getHeatmapColor(nf)}`}
            >
              <span className="text-sm md:text-xl">{nf.number}</span>
              <span className="text-[10px] md:text-xs opacity-75">{nf.count}次</span>
            </div>
          ))}
        </div>
      </div>

      {/* 主要分析區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI 推薦號碼 */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-gold-400" size={24} />
            <h2 className="text-xl font-semibold text-white">AI 推薦號碼 ({aiRecommendations.length}組)</h2>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {aiRecommendations.map((rec, idx) => (
              <div key={rec.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gold-400 font-semibold">
                    推薦 #{idx + 1} - {rec.strategy}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-semibold">
                      信心度 {(rec.confidence * 100).toFixed(0)}%
                    </span>
                    <span className="text-sm px-2 py-1 bg-gray-700 rounded text-gray-300">
                      {rec.aiScore}分
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  {rec.numbers.map((num, numIdx) => (
                    <div
                      key={numIdx}
                      className="number-ball-gold"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 號碼出現頻率 */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-blue-400" size={24} />
            <h2 className="text-xl font-semibold text-white">號碼出現頻率 Top 15</h2>
          </div>
          <div className="h-64">
            <Bar data={frequencyChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* 第二排分析區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近 10 期大小號趨勢 */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-yellow-400" size={24} />
            <h2 className="text-xl font-semibold text-white">最近 10 期大小號趨勢</h2>
          </div>
          <div className="h-64">
            <Line data={recentTrendData} options={recentTrendOptions} />
          </div>
        </div>

        {/* 共現關係 */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-green-400" size={24} />
            <h2 className="text-xl font-semibold text-white">號碼共現關係 Top 20</h2>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {cooccurrences.map((cooc, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">#{idx + 1}</span>
                  {cooc.numbers.map((num, numIdx) => (
                    <div key={numIdx} className="number-ball-blue text-sm w-8 h-8">
                      {num}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 font-semibold">{cooc.count}次</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 遺漏值分析 */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Target className="text-purple-400" size={24} />
          <h2 className="text-xl font-semibold text-white">遺漏值分析 (前 10 個遺漏最久的號碼)</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {numberFrequencies
            .sort((a, b) => b.missingRounds - a.missingRounds)
            .slice(0, 10)
            .map((nf) => (
              <div key={nf.number} className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">{nf.number}</div>
                <div className="text-sm text-gray-400">遺漏 {nf.missingRounds} 期</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
