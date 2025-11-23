import { useState, useEffect } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { Stats } from './components/Stats';
import { Clicker } from './components/Clicker';
import { Shop } from './components/Shop';
import { Leaderboard } from './components/Leaderboard';
import { Tasks } from './components/Tasks';
import { Friends } from './components/Friends';
import { Welcome } from './components/Welcome';
import { OfflineEarnings } from './components/OfflineEarnings';
import { Airdrop } from './components/Airdrop';
import { SplashScreen } from './components/SplashScreen';
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
    setProfile,
    requestNotificationPermission,
    miningCards,
    profitPerHour,
    buyCard,
    offlineEarnings,
    claimOfflineEarnings
  } = useGameLogic();

  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<'shop' | 'leaderboard' | 'tasks' | 'referrals' | 'airdrop' | null>(null);

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };
    if (sdk && sdk.actions) {
      load();
    }
  }, []);

  if (isLoading) {
    return <SplashScreen onComplete={() => setIsLoading(false)} />;
  }

  // Show Welcome screen if no username
  if (!username) {
    return <Welcome onComplete={setProfile} />;
  }

  return (
    <div className="app-container">
      <div className="header">
        <div className="profile-info">
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #0052FF, #4da6ff)' }} />
          <span className="username">@{username || 'user'}</span>
        </div>
        <button
          onClick={requestNotificationPermission}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white'
          }}
          title="Enable Notifications"
        >
          🔔
        </button>
      </div>

      <Stats score={score} energy={energy} maxEnergy={maxEnergy} />

      <div className="game-area">
        <Clicker onClick={incrementScore} />
      </div>

      <div className="menu-buttons">
        <button className="menu-btn" onClick={() => setActiveModal('shop')}>
          <span>🛒</span> Shop
        </button>
        <button className="menu-btn" onClick={() => setActiveModal('tasks')}>
          <span>📋</span> Tasks
        </button>
        <button className="menu-btn" onClick={() => setActiveModal('referrals')}>
          <span>👥</span> Friends
        </button>
        <button className="menu-btn" onClick={() => setActiveModal('airdrop')}>
          <span>🪂</span> Airdrop
        </button>
      </div>

      {activeModal === 'shop' && (
        <Shop
          onClose={() => setActiveModal(null)}
          score={score}
          multitapLevel={multitapLevel}
          energyLimitLevel={energyLimitLevel}
          buyUpgrade={buyUpgrade}
          miningCards={miningCards}
          profitPerHour={profitPerHour}
          buyCard={buyCard}
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

      {activeModal === 'referrals' && (
        <Friends onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'airdrop' && (
        <Airdrop onClose={() => setActiveModal(null)} />
      )}

      <OfflineEarnings
        earnings={offlineEarnings}
        onClaim={claimOfflineEarnings}
      />
    </div>
  );
}

export default App;
