import { useState, useEffect } from 'react';
import './App.css';
import { useGameLogic } from './hooks/useGameLogic';
import { Stats } from './components/Stats';
import { Clicker } from './components/Clicker';
import { Shop } from './components/Shop';
import { Leaderboard } from './components/Leaderboard';
import { Tasks } from './components/Tasks';
import { Friends } from './components/Friends';
import { Welcome } from './components/Welcome';
import sdk from '@farcaster/frame-sdk';

function App() {
  const {
    score,
    totalScore,
    energy,
    maxEnergy,
    incrementScore,
    multitapLevel,
    energyLimitLevel,
    buyUpgrade,
    addReward,
    username,
    setProfile
  } = useGameLogic();

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };
    if (sdk && sdk.actions) {
      load();
    }
  }, []);

  const [activeModal, setActiveModal] = useState<'shop' | 'leaderboard' | 'tasks' | 'friends' | null>(null);

  // Show Welcome screen if no username
  if (!username) {
    return <Welcome onComplete={setProfile} />;
  }

  return (
    <div className="app-container">
      <div className="header">
        <div className="profile-info">
          <span className="username">{username}</span>
        </div>
      </div>

      <Stats score={score} energy={energy} maxEnergy={maxEnergy} />

      <div className="game-area">
        <Clicker onClick={incrementScore} />
      </div>

      <div className="menu-bar">
        <button onClick={() => setActiveModal('shop')}>🛒 Shop</button>
        <button onClick={() => setActiveModal('tasks')}>📋 Tasks</button>
        <button onClick={() => setActiveModal('friends')}>👥 Friends</button>
        <button onClick={() => setActiveModal('leaderboard')}>🏆 Rank</button>
      </div>

      {activeModal === 'shop' && (
        <Shop
          onClose={() => setActiveModal(null)}
          score={score}
          multitapLevel={multitapLevel}
          energyLimitLevel={energyLimitLevel}
          buyUpgrade={buyUpgrade}
        />
      )}

      {activeModal === 'leaderboard' && (
        <Leaderboard
          onClose={() => setActiveModal(null)}
          currentScore={totalScore}
          username={username}
        />
      )}

      {activeModal === 'tasks' && (
        <Tasks
          onClose={() => setActiveModal(null)}
          addReward={addReward}
        />
      )}

      {activeModal === 'friends' && (
        <Friends onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}

export default App;
