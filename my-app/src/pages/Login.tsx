import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

const BookIcon = ({ color = '#1F2937', glow = false }: { color?: string; glow?: boolean }) => (
  <svg width="72" height="72" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={glow ? { filter: `drop-shadow(0 0 18px ${color}66)` } : undefined}>
    <path d="M50 24C42 17 28 14 15 16v54c13-2 27 1 35 8" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M50 24c8-7 22-10 35-8v54c-13-2-27 1-35 8" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M50 24v62" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await AuthService.signIn(username, password);
      TokenService.setTokens(response);
      navigate('/authors');
    } catch (err: any) {
      setError(typeof err === 'string' ? err : 'Login failed');
      console.error(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Left panel — credential form */}
      <div style={{ flex: '1 1 55%', background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
        <BookIcon color="#1F2937" />
        <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '28px', fontWeight: 700, color: '#1F2937', margin: '20px 0 4px', lineHeight: 1.25, maxWidth: '360px' }}>
          HSMSS Library Management System
        </h1>
        <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 28px' }}>Please enter your credentials</p>

        <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={handleKeyDown} style={inputStyle} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} style={inputStyle} />
          <div style={{ textAlign: 'left', marginTop: '-4px' }}>
            <a href="#" style={{ fontSize: '12.5px', color: '#6B7280', textDecoration: 'underline' }}>Forgot password?</a>
          </div>
          {error && <p style={{ color: '#C0392B', fontSize: '13px', margin: '0' }}>{error}</p>}
          <button onClick={handleLogin} style={primaryButtonStyle}>Log In</button>
        </div>
      </div>

      {/* Right panel — brand */}
      <div style={{ flex: '1 1 45%', background: 'linear-gradient(160deg, #2C5F7C 0%, #204a63 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <BookIcon color="#EAF2F6" glow />
        <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#FFFFFF', fontSize: '34px', fontWeight: 700, margin: '18px 0 40px', lineHeight: 1.2 }}>
          HSMSS<br />Library
        </h2>
        <p style={{ color: '#DCE6EC', fontSize: '14px', margin: '0 0 14px' }}>New to our platform?</p>
        <button style={secondaryButtonStyle}>Register</button>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = { padding: '12px 14px', borderRadius: '8px', border: '1px solid #D9D9D9', background: '#EFEFEF', fontSize: '14px', color: '#1F2937', outline: 'none' };
const primaryButtonStyle: React.CSSProperties = { marginTop: '10px', padding: '12px', borderRadius: '8px', border: 'none', background: '#2C5F7C', color: '#FFFFFF', fontSize: '14.5px', fontWeight: 600, cursor: 'pointer' };
const secondaryButtonStyle: React.CSSProperties = { padding: '10px 28px', borderRadius: '8px', border: 'none', background: '#EAF2F6', color: '#204a63', fontSize: '14px', fontWeight: 600, cursor: 'pointer' };

export default Login;