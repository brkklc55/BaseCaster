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

      {/* New score display and share button */}
      <div className="score-display">
        <img src="/icon.png" alt="Coin" style={{ width: '24px', height: '24px', marginRight: '8px', verticalAlign: 'middle' }} />
        {Math.floor(score).toLocaleString()}
      </div>

      <button
        onClick={() => {
          const text = `I just reached ${Math.floor(score).toLocaleString()} points on Basecaster Tap2Earn! Can you beat me? 🚀`;
          const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=https://base-caster-ebon.vercel.app`;
          window.open(url, '_blank');
        }}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          cursor: 'pointer',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '0 auto 20px auto'
        }}
      >
        <span>📤</span> Share Progress
      </button>

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
