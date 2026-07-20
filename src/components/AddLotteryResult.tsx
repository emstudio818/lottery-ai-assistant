import { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useLotteryData } from '../lib/useLotteryData';

export default function AddLotteryResult() {
  const { addNewResult, resetToDefault } = useLotteryData();
  const [isOpen, setIsOpen] = useState(false);
  const [period, setPeriod] = useState('');
  const [date, setDate] = useState('');
  const [numbers, setNumbers] = useState<string[]>(['', '', '', '', '', '']);
  const [specialNumber, setSpecialNumber] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleNumberChange = (index: number, value: string) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 驗證輸入
    const parsedNumbers = numbers.map(n => parseInt(n)).filter(n => !isNaN(n));
    const parsedSpecial = parseInt(specialNumber);
    
    if (parsedNumbers.length !== 6) {
      setMessage({ text: '請輸入完整的6個開獎號碼', type: 'error' });
      return;
    }
    
    if (isNaN(parsedSpecial)) {
      setMessage({ text: '請輸入特別號', type: 'error' });
      return;
    }
    
    // 確認號碼在 1-49 之間
    for (const num of [...parsedNumbers, parsedSpecial]) {
      if (num < 1 || num > 49) {
        setMessage({ text: '所有號碼必須在 1-49 之間', type: 'error' });
        return;
      }
    }
    
    // 新增開獎結果
    addNewResult(period, date, parsedNumbers.sort((a, b) => a - b), parsedSpecial);
    setMessage({ text: '成功新增開獎結果！所有分析數據已自動更新', type: 'success' });
    
    // 清空表單
    setPeriod('');
    setDate('');
    setNumbers(['', '', '', '', '', '']);
    setSpecialNumber('');
    
    // 3秒後清除訊息
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plus className="text-gold-400" size={20} />
          <h2 className="text-xl font-bold text-white">手動新增開獎結果</h2>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          {isOpen ? '收起' : '展開'}
        </button>
      </div>
      
      {isOpen && (
        <div className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">期別</label>
                <input
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="例如: 115000072"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">開獎日期</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="例如: 115/07/21"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">開獎號碼 (6個)</label>
              <div className="flex gap-2">
                {numbers.map((num, idx) => (
                  <input
                    key={idx}
                    type="number"
                    min="1"
                    max="49"
                    value={num}
                    onChange={(e) => handleNumberChange(idx, e.target.value)}
                    placeholder={(idx + 1).toString()}
                    className="w-16 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-center focus:outline-none focus:border-blue-500"
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">特別號</label>
              <input
                type="number"
                min="1"
                max="49"
                value={specialNumber}
                onChange={(e) => setSpecialNumber(e.target.value)}
                className="w-24 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold-500"
              />
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all"
              >
                新增開獎結果
              </button>
              
              <button
                type="button"
                onClick={resetToDefault}
                className="px-6 py-3 bg-gray-800 text-gray-300 font-semibold rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} />
                重置數據
              </button>
            </div>
          </form>
          
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-900/30 border border-green-700 text-green-300' 
                : 'bg-red-900/30 border border-red-700 text-red-300'
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">💡 使用說明</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• 新增開獎結果後，所有分析數據會自動重新計算</li>
              <li>• 回測分析會自動根據最新數據更新</li>
              <li>• 數據會保存到您的瀏覽器本地存儲</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
