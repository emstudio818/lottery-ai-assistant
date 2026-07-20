import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HistoryPageComponent from './pages/History';
import Backtest from './pages/Backtest';
import LotteryMachine from './pages/LotteryMachine';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lottery-machine" element={<LotteryMachine />} />
          <Route path="/history" element={<HistoryPageComponent />} />
          <Route path="/backtest" element={<Backtest />} />
        </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
