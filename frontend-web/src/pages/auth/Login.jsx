import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Login = () => {
  const [role, setRole] = useState('medecin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        role
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

    if (response.data.role === 'medecin') {
      navigate('/dashboard/medecin');
    } else {
      setError('MEDICA+ patient est disponible uniquement sur mobile. Téléchargez l\'application pour accéder à votre espace.');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }

    } catch (err) {
      setError(err.response?.data?.error || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#070b14',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#0d1321',
        border: '0.5px solid #1e3a5f',
        borderRadius: '12px',
        padding: '2.5rem'
      }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-block',
            background: '#0a2540',
            border: '0.5px solid #1e3a5f',
            borderRadius: '20px',
            padding: '3px 12px',
            fontSize: '10px',
            color: '#3b9eff',
            letterSpacing: '2px',
            marginBottom: '0.5rem'
          }}>
            PLATEFORME MEDICALE
          </div>
          <div style={{ fontSize: '28px', fontWeight: '500', color: '#e8e8e8', letterSpacing: '3px' }}>
            MEDICA<span style={{ color: '#3b9eff' }}>+</span>
          </div>
          <div style={{ width: '40px', height: '1px', background: '#c9a84c', margin: '0.75rem auto' }}></div>
          <div style={{ fontSize: '11px', color: '#3b6ea6', letterSpacing: '5px' }}>
            PREMIUM HEALTH PLATFORM
          </div>
        </div>

        {/* TABS */}
        <div style={{
          display: 'flex',
          borderBottom: '1.5px solid #1e3a5f',
          marginBottom: '2rem'
        }}>
          <button style={{
            flex: 1, padding: '10px',
            background: 'transparent',
            border: 'none',
            borderBottom: '2px solid #c9a84c',
            color: '#3b9eff',
            fontSize: '13px',
            cursor: 'pointer'
          }}>
            Connexion
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{
              flex: 1, padding: '10px',
              background: 'transparent',
              border: 'none',
              borderBottom: '2px solid transparent',
              color: '#4a6fa5',
              fontSize: '13px',
              cursor: 'pointer'
            }}>
            Inscription
          </button>
        </div>

        {/* FORM */}
        <div>
          <div style={{ fontSize: '11px', color: '#4a6fa5', letterSpacing: '2px', marginBottom: '6px' }}>
            ADRESSE EMAIL
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemple@medica.fr"
            style={{
              width: '100%', background: '#0a1628',
              border: '0.5px solid #1e3a5f',
              borderRadius: '8px', padding: '11px 13px',
              color: '#d0e4f7', fontSize: '14px',
              boxSizing: 'border-box', outline: 'none'
            }}
          />

          <div style={{ fontSize: '11px', color: '#4a6fa5', letterSpacing: '2px', marginBottom: '6px', marginTop: '1rem' }}>
            MOT DE PASSE
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%', background: '#0a1628',
              border: '0.5px solid #1e3a5f',
              borderRadius: '8px', padding: '11px 13px',
              color: '#d0e4f7', fontSize: '14px',
              boxSizing: 'border-box', outline: 'none'
            }}
          />

          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '11px', color: '#4a6fa5', letterSpacing: '2px', marginBottom: '8px' }}>
              VOUS ETES
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setRole('medecin')}
                style={{
                  flex: 1, padding: '10px',
                  border: role === 'medecin' ? '0.5px solid #c9a84c' : '0.5px solid #1e3a5f',
                  borderRadius: '8px',
                  background: role === 'medecin' ? '#c9a84c0f' : '#0a1628',
                  color: role === 'medecin' ? '#c9a84c' : '#4a6fa5',
                  fontSize: '13px', cursor: 'pointer'
                }}>
                Medecin
              </button>
              <button
                onClick={() => setRole('patient')}
                style={{
                  flex: 1, padding: '10px',
                  border: role === 'patient' ? '0.5px solid #c9a84c' : '0.5px solid #1e3a5f',
                  borderRadius: '8px',
                  background: role === 'patient' ? '#c9a84c0f' : '#0a1628',
                  color: role === 'patient' ? '#c9a84c' : '#4a6fa5',
                  fontSize: '13px', cursor: 'pointer'
                }}>
                Patient
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#1a0a0a',
              border: '0.5px solid #ff4444',
              borderRadius: '8px',
              padding: '10px 13px',
              color: '#ff6b6b',
              fontSize: '13px',
              marginTop: '1rem'
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', marginTop: '1.5rem',
              padding: '13px', background: loading ? '#061830' : '#0a4d8c',
              border: '1px solid #c9a84c55',
              borderRadius: '8px', color: '#e8f4ff',
              fontSize: '14px', fontWeight: '500',
              letterSpacing: '2px', cursor: loading ? 'not-allowed' : 'pointer'
            }}>
            {loading ? 'CONNEXION EN COURS...' : 'SE CONNECTER'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '12px', color: '#2a4a6a' }}>
            Mot de passe oublie ? <span style={{ color: '#c9a84c88', cursor: 'pointer' }}>Reinitialiser</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;