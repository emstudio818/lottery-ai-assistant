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
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-gold-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-base md:text-lg">AI</span>
            </div>
            <span className="text-base md:text-xl font-bold bg-gradient-to-r from-blue-400 to-gold-400 bg-clip-text text-transparent hidden md:block">
              大樂透 AI 助手
            </span>
          </div>
          
          <div className="flex items-center gap-0.5 md:gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-gold-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-medium text-xs md:text-sm hidden md:block">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
