import { NavLink } from 'react-router-dom';
import { Home, History, BarChart3, Trophy } from 'lucide-react';

export default function Navbar() {

  const navItems = [
    { to: '/', label: '首頁', icon: Home },
    { to: '/lottery-machine', label: '搖獎機', icon: Trophy },
    { to: '/history', label: '歷史記錄', icon: History },
    { to: '/backtest', label: '回測分析', icon: BarChart3 },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-gold-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-gold-400 bg-clip-text text-transparent">
              大樂透 AI 助手
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-gold-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`
                  }
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
