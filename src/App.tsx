import { useState } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { Stats } from './components/Stats';
import { Clicker } from './components/Clicker';
import { Shop } from './components/Shop';
import { Leaderboard } from './components/Leaderboard';
import { Tasks } from './components/Tasks';
import { Friends } from './components/Friends';

function App() {
  const {
    score,
    energy,
    maxEnergy,
    incrementScore,
    multitapLevel,
    energyLimitLevel,
    buyUpgrade,
    totalScore,
    addReward // Need to expose this from hook
  } = useGameLogic();

  const [activeModal, setActiveModal] = useState<'shop' | 'leaderboard' | 'tasks' | 'friends' | null>(null);

  return (
    <div className="container">
      <h1>Basecaster</h1>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Clicker onClick={incrementScore} />
      </div>

      <div style={{ width: '100%' }}>
        <Stats score={score} energy={energy} maxEnergy={maxEnergy} />

        <div className="menu-buttons">
          <button className="menu-btn" onClick={() => setActiveModal('shop')}>
            🚀 Boosts
          </button>
          <button className="menu-btn" onClick={() => setActiveModal('tasks')}>
            📋 Tasks
          </button>
          <button className="menu-btn" onClick={() => setActiveModal('friends')}>
            👥 Friends
          </button>
          <button className="menu-btn" onClick={() => setActiveModal('leaderboard')}>
            🏆 Top
          </button>
        </div>
      </div>

      {activeModal === 'shop' && (
        <Shop
          score={score}
          multitapLevel={multitapLevel}
          energyLimitLevel={energyLimitLevel}
          onBuy={buyUpgrade}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'leaderboard' && (
        <Leaderboard currentScore={totalScore} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'tasks' && (
        <Tasks
          onClose={() => setActiveModal(null)}
          onReward={addReward}
        />
      )}

      {activeModal === 'friends' && (
        <Friends onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}

export default App;
