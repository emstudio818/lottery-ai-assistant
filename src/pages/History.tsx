import { History as HistoryIcon, Calendar } from 'lucide-react';
import AddLotteryResult from '../components/AddLotteryResult';
import { useLotteryData } from '../lib/useLotteryData';

export default function HistoryPageComponent() {
  const { lotteryResults } = useLotteryData();
  
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-2 md:gap-3">
        <HistoryIcon className="text-blue-400 w-6 h-6 md:w-8 md:h-8" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">歷史開獎記錄</h1>
          <p className="text-sm md:text-base text-gray-400">查看過往的開獎結果</p>
        </div>
      </div>

      <AddLotteryResult />

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-2 md:py-4 md:px-4 text-xs md:text-sm text-gray-400 font-semibold">期別</th>
                <th className="text-left py-3 px-2 md:py-4 md:px-4 text-xs md:text-sm text-gray-400 font-semibold">日期</th>
                <th className="text-left py-3 px-2 md:py-4 md:px-4 text-xs md:text-sm text-gray-400 font-semibold">開獎號碼</th>
                <th className="text-left py-3 px-2 md:py-4 md:px-4 text-xs md:text-sm text-gray-400 font-semibold">特別號</th>
              </tr>
            </thead>
            <tbody>
              {lotteryResults.map((result) => (
                <tr
                  key={result.id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                >
                  <td className="py-3 px-2 md:py-4 md:px-4">
                    <span className="text-gold-400 font-semibold text-xs md:text-sm">{result.period}</span>
                  </td>
                  <td className="py-3 px-2 md:py-4 md:px-4">
                    <div className="flex items-center gap-1 md:gap-2 text-gray-300 text-xs md:text-sm">
                      <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
                      {result.date}
                    </div>
                  </td>
                  <td className="py-3 px-2 md:py-4 md:px-4">
                    <div className="flex items-center gap-1 md:gap-2">
                      {result.numbers.map((num, idx) => (
                        <div
                          key={idx}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-2 md:py-4 md:px-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm bg-gradient-to-br from-yellow-500 to-gold-600 text-white shadow-lg shadow-gold-500/30">
                      {result.specialNumber}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}