import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Register = () => {
  const [role, setRole] = useState('medecin');
  const [details, setDetails] = useState([]);
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '',
    password: '', confirm: '', telephone: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setError('');
  setLoading(true);

  if (form.password !== form.confirm) {
    setError('Les mots de passe ne correspondent pas');
    return;
  }

  setLoading(true);

  try {
    const response = await api.post('/auth/register', {
      email: form.email,
      password: form.password,
      confirm: form.confirm,
      role,
      prenom: form.prenom,
      nom: form.nom,
      telephone: form.telephone,
      ...(role === 'medecin' && {
        specialite: form.specialite,
        rpps: form.rpps
      }),
      ...(role === 'patient' && {
        dateNaissance: form.dateNaissance,
        nss: form.nss
      })
    });

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.role);

    if (response.data.role === 'medecin') {
      navigate('/dashboard/medecin');
    } else {
      navigate('/dashboard/patient');
    }

  } catch (err) {
  setError(err.response?.data?.error || 'Une erreur est survenue');
  setDetails(err.response?.data?.details || []);  
} finally {
    setLoading(false);
  }
};

  const inputStyle = {
    width: '100%', background: '#0a1628',
    border: '0.5px solid #1e3a5f',
    borderRadius: '8px', padding: '11px 13px',
    color: '#d0e4f7', fontSize: '14px',
    boxSizing: 'border-box', outline: 'none'
  };

  const labelStyle = {
    fontSize: '11px', color: '#4a6fa5',
    letterSpacing: '2px', marginBottom: '6px',
    marginTop: '1rem', display: 'block'
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
        <div style={{ display: 'flex', borderBottom: '1.5px solid #1e3a5f', marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              flex: 1, padding: '10px',
              background: 'transparent', border: 'none',
              borderBottom: '2px solid transparent',
              color: '#4a6fa5', fontSize: '13px', cursor: 'pointer'
            }}>
            Connexion
          </button>
          <button style={{
            flex: 1, padding: '10px',
            background: 'transparent', border: 'none',
            borderBottom: '2px solid #c9a84c',
            color: '#3b9eff', fontSize: '13px', cursor: 'pointer'
          }}>
            Inscription
          </button>
        </div>

        {/* ROLE */}
        <div>
          <div style={{ fontSize: '11px', color: '#4a6fa5', letterSpacing: '2px', marginBottom: '8px' }}>
            VOUS ETES
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
  <button
    onClick={() => {
      setRole('medecin');
      setError('');
    }}
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
    onClick={() => setError('MEDICA+ patient est disponible uniquement sur mobile. Téléchargez l\'application pour accéder à votre espace.')}
    style={{
      flex: 1, padding: '10px',
      border: '0.5px solid #1e3a5f',
      borderRadius: '8px',
      background: '#0a1628',
      color: '#4a6fa5',
      fontSize: '13px', cursor: 'pointer'
    }}>
    Patient
  </button>
</div>

          {/* CHAMPS COMMUNS */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>PRENOM</label>
              <input name="prenom" onChange={handleChange} placeholder="Jean" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>NOM</label>
              <input name="nom" onChange={handleChange} placeholder="Dupont" style={inputStyle} />
            </div>
          </div>

          <label style={labelStyle}>ADRESSE EMAIL</label>
          <input name="email" type="email" onChange={handleChange} placeholder="exemple@medica.fr" style={inputStyle} />

          <label style={labelStyle}>TELEPHONE</label>
          <input name="telephone" type="tel" onChange={handleChange} placeholder="+33 6 00 00 00 00" style={inputStyle} />

          {/* CHAMPS SPECIFIQUES MEDECIN */}
          {role === 'medecin' && (
            <>
              <label style={labelStyle}>SPECIALITE</label>
              <select name="specialite" onChange={handleChange} style={{ ...inputStyle, color: '#d0e4f7' }}>
                <option value="" style={{ background: '#0a1628' }}>Selectionnez une specialite</option>
                <option value="generaliste" style={{ background: '#0a1628' }}>Medecin generaliste</option>
                <option value="cardiologue" style={{ background: '#0a1628' }}>Cardiologue</option>
                <option value="dermatologue" style={{ background: '#0a1628' }}>Dermatologue</option>
                <option value="pediatre" style={{ background: '#0a1628' }}>Pediatre</option>
                <option value="neurologue" style={{ background: '#0a1628' }}>Neurologue</option>
                <option value="psychiatre" style={{ background: '#0a1628' }}>Psychiatre</option>
              </select>

              <label style={labelStyle}>NUMERO RPPS</label>
              <input name="rpps" onChange={handleChange} placeholder="Ex: 10003456789" style={inputStyle} />
            </>
          )}

          {/* CHAMPS SPECIFIQUES PATIENT */}
          {role === 'patient' && (
            <>
              <label style={labelStyle}>DATE DE NAISSANCE</label>
              <input name="dateNaissance" type="date" onChange={handleChange} style={{ ...inputStyle, colorScheme: 'dark' }} />

              <label style={labelStyle}>NUMERO DE SECURITE SOCIALE</label>
              <input name="nss" onChange={handleChange} placeholder="1 85 05 75 108 001 48" style={inputStyle} />
            </>
          )}

          <label style={labelStyle}>MOT DE PASSE</label>
          <input name="password" type="password" onChange={handleChange} placeholder="••••••••" style={inputStyle} />

          <label style={labelStyle}>CONFIRMER LE MOT DE PASSE</label>
          <input name="confirm" type="password" onChange={handleChange} placeholder="••••••••" style={inputStyle} />
{error && (
  <div style={{
    background: '#1a0a0a',
    border: '0.5px solid #ff4444',
    borderRadius: '8px',
    padding: '10px 13px',
    marginTop: '1rem'
  }}>
    <div style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: details.length > 0 ? '8px' : '0' }}>
      {error}
    </div>
    {details.map((d, i) => (
      <div key={i} style={{ color: '#ff9999', fontSize: '12px', paddingLeft: '8px' }}>
        • {d}
      </div>
    ))}
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
  {loading ? 'CREATION EN COURS...' : 'CREER MON COMPTE'}
</button>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '12px', color: '#2a4a6a' }}>
            Deja un compte ? <span
              onClick={() => navigate('/login')}
              style={{ color: '#c9a84c88', cursor: 'pointer' }}>
              Se connecter
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;