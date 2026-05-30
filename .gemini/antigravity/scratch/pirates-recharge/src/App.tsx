import { useState } from 'react';
import { 
  MessageCircle, 
  UserCircle2, 
  Wallet, 
  Home, 
  Users, 
  Gift, 
  RotateCcw,
  Rocket,
  CircleDot,
  Dices,
  Target,
  Swords,
  Coins
} from 'lucide-react';

const LoginView = ({ onLogin }: { onLogin: () => void }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
      <div style={{ padding: '3rem 0 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'black' }}>
          Pirates<span style={{ color: '#e74c3c' }}>.</span>
        </h1>
      </div>

      <div style={{ 
        flex: 1, 
        background: '#f8f9fa', 
        borderTopLeftRadius: '24px', 
        borderTopRightRadius: '24px',
        padding: '0'
      }}>
        <div style={{ 
          display: 'flex', 
          background: 'var(--color-primary)', 
          borderTopLeftRadius: '24px', 
          borderTopRightRadius: '24px',
          padding: '1rem'
        }}>
          <div 
            onClick={() => setActiveTab('login')}
            style={{ flex: 1, textAlign: 'center', color: activeTab === 'login' ? 'white' : 'rgba(255,255,255,0.7)', fontWeight: 600, cursor: 'pointer' }}
          >
            LOGIN
          </div>
          <div 
            onClick={() => setActiveTab('signup')}
            style={{ flex: 1, textAlign: 'center', color: activeTab === 'signup' ? 'white' : 'rgba(255,255,255,0.7)', fontWeight: 600, cursor: 'pointer' }}
          >
            SIGN UP
          </div>
        </div>

        <div style={{ padding: '2rem', background: 'white', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: '#1c1e21' }}>
            {activeTab === 'login' ? 'Welcome back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            {activeTab === 'login' ? 'Sign in with your account' : 'Sign up to start playing'}
          </p>

          <div className="input-group">
            <label className="input-label">Phone</label>
            <input type="text" className="input-field" placeholder="Enter phone number" />
          </div>

          <div className="input-group" style={{ marginBottom: '2.5rem' }}>
            <label className="input-label">Password</label>
            <input type="password" className="input-field" placeholder="Input password" />
          </div>

          <button className="btn-primary" onClick={onLogin}>
            {activeTab === 'login' ? 'LOGIN' : 'SIGN UP'}
          </button>

          {activeTab === 'login' && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Forgot your password? <a href="#" style={{ cursor: 'pointer' }}>Reset here</a>
              </p>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('signup'); }} style={{ cursor: 'pointer' }}>Register</a>
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="floating-chat">
        <MessageCircle size={24} />
      </div>
    </div>
  );
};

const MainAppView = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'invite' | 'recharge' | 'profile'>('home');

  const games = [
    { name: 'Crash', icon: <Rocket size={40} color="white" />, bg: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)', label: 'New!' },
    { name: 'Fast-Parity', icon: <CircleDot size={40} color="white" />, bg: 'linear-gradient(135deg, #1cb5e0 0%, #000851 100%)', time: '30 Sec' },
    { name: 'WinGo', icon: <Target size={40} color="white" />, bg: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)', time: '60 Sec' },
    { name: 'Lottery', icon: <Dices size={40} color="white" />, bg: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)', label: 'Instant' },
    { name: 'Circle', icon: <Coins size={40} color="white" />, bg: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', time: '30 Sec' },
    { name: 'Dragon Tiger', icon: <Swords size={40} color="white" />, bg: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)' }
  ];

  return (
    <div style={{ flex: 1, paddingBottom: '70px', display: 'flex', flexDirection: 'column' }}>
      
      {currentTab === 'home' && (
        <>
          <div className="marquee-container">
            <UserCircle2 size={18} color="var(--color-text-muted)" />
            <div className="marquee-text">
              **7717 Wins <span>₹19600.00</span> in FastParity game
            </div>
          </div>

          <div style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Balance</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>34.51</h2>
                <span style={{ fontWeight: 600 }}>rupee</span>
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', background: '#f0f2f5', padding: '0.25rem 0.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                ID: BXMG1SEW
              </div>

              <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '300px' }}>
                <button className="btn-primary" onClick={() => setCurrentTab('recharge')} style={{ flex: 1, borderRadius: '24px', padding: '0.75rem', background: 'linear-gradient(to right, #00c6ff, #0072ff)' }}>Recharge</button>
                <button style={{ flex: 1, borderRadius: '24px', padding: '0.75rem', background: 'white', color: 'var(--color-text-main)', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>Withdraw</button>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', background: '#e7f3ff', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                  <Gift size={16} /> Rewards
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-green)', background: '#e8f8f0', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                  <RotateCcw size={16} /> Hourly Spin
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {games.map((g, i) => (
                <div key={i} style={{ 
                  background: g.bg, 
                  borderRadius: '16px', 
                  padding: '1.5rem 1rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '140px',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  {g.label && (
                    <div style={{ position: 'absolute', top: 0, left: 0, background: '#ff3b30', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderBottomRightRadius: '8px' }}>
                      {g.label}
                    </div>
                  )}
                  {g.time && (
                    <div style={{ position: 'absolute', bottom: '10px', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
                      {g.time}
                    </div>
                  )}
                  <div style={{ marginBottom: '0.5rem' }}>{g.icon}</div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>{g.name}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {currentTab === 'invite' && (
        <div style={{ padding: '2rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Users size={64} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Invite Friends</h2>
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '2rem' }}>Invite your friends and earn rewards for every successful referral.</p>
          <div className="card" style={{ width: '100%', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Your Referral Code</h3>
            <div style={{ background: '#f0f2f5', padding: '1rem', borderRadius: '8px', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '1rem' }}>PIRATE99</div>
            <button className="btn-primary">Copy Link</button>
          </div>
        </div>
      )}

      {currentTab === 'recharge' && (
        <div style={{ padding: '2rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Wallet size={64} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Recharge Wallet</h2>
          <div className="card" style={{ width: '100%' }}>
            <div className="input-group">
              <label className="input-label">Amount (₹)</label>
              <input type="number" className="input-field" placeholder="Enter amount to recharge" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {[100, 500, 1000, 2000, 5000, 10000].map((amt) => (
                <div key={amt} style={{ padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                  ₹{amt}
                </div>
              ))}
            </div>
            <button className="btn-primary">Proceed to Pay</button>
          </div>
        </div>
      )}

      {currentTab === 'profile' && (
        <div style={{ padding: '2rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <UserCircle2 size={80} color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '0.25rem' }}>User BXMG1SEW</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>+91 98765 43210</p>
          
          <div className="card" style={{ width: '100%', padding: '0' }}>
            {['Transaction History', 'Security Settings', 'Help & Support', 'About Us'].map((item, idx) => (
              <div key={item} style={{ padding: '1rem 1.5rem', borderBottom: idx !== 3 ? '1px solid var(--color-border)' : 'none', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span style={{ fontWeight: 500 }}>{item}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>&gt;</span>
              </div>
            ))}
          </div>
          
          <button style={{ width: '100%', padding: '1rem', marginTop: '2rem', color: '#e74c3c', fontWeight: 600, background: 'white', borderRadius: '8px', border: '1px solid #e74c3c' }}>
            Log Out
          </button>
        </div>
      )}

      <div className="bottom-nav">
        <div className={`nav-item ${currentTab === 'home' ? 'active' : ''}`} onClick={() => setCurrentTab('home')} style={{ cursor: 'pointer' }}>
          <Home size={24} color={currentTab === 'home' ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
          <span>Home</span>
        </div>
        <div className={`nav-item ${currentTab === 'invite' ? 'active' : ''}`} onClick={() => setCurrentTab('invite')} style={{ cursor: 'pointer' }}>
          <Users size={24} color={currentTab === 'invite' ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
          <span>Invite</span>
        </div>
        <div className={`nav-item ${currentTab === 'recharge' ? 'active' : ''}`} onClick={() => setCurrentTab('recharge')} style={{ cursor: 'pointer' }}>
          <Wallet size={24} color={currentTab === 'recharge' ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
          <span>Recharge</span>
        </div>
        <div className={`nav-item ${currentTab === 'profile' ? 'active' : ''}`} onClick={() => setCurrentTab('profile')} style={{ cursor: 'pointer' }}>
          <UserCircle2 size={24} color={currentTab === 'profile' ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
          <span>Profile</span>
        </div>
      </div>
      
      <div className="floating-chat" style={{ bottom: '5rem' }}>
        <MessageCircle size={24} />
      </div>
    </div>
  );
};

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'main'>('login');

  return (
    <div className="mobile-container">
      {currentView === 'login' ? (
        <LoginView onLogin={() => setCurrentView('main')} />
      ) : (
        <MainAppView />
      )}
    </div>
  );
}

export default App;
