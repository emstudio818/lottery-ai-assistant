import { History as HistoryIcon, Calendar } from 'lucide-react';
import AddLotteryResult from '../components/AddLotteryResult';
import { useLotteryData } from '../lib/useLotteryData';

export default function HistoryPageComponent() {
  const { lotteryResults } = useLotteryData();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <HistoryIcon className="text-blue-400" size={32} />
        <div>
          <h1 className="text-3xl font-bold text-white">歷史開獎記錄</h1>
          <p className="text-gray-400">查看過往的開獎結果</p>
        </div>
      </div>

      <AddLotteryResult />

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-400 font-semibold">期別</th>
                <th className="text-left py-4 px-4 text-gray-400 font-semibold">日期</th>
                <th className="text-left py-4 px-4 text-gray-400 font-semibold">開獎號碼</th>
                <th className="text-left py-4 px-4 text-gray-400 font-semibold">特別號</th>
              </tr>
            </thead>
            <tbody>
              {lotteryResults.map((result) => (
                <tr
                  key={result.id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="text-gold-400 font-semibold">{result.period}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar size={16} className="text-gray-500" />
                      {result.date}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {result.numbers.map((num, idx) => (
                        <div
                          key={idx}
                          className="number-ball-blue"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="number-ball-gold">
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