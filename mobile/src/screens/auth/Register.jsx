import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const Register = ({ navigation }) => {
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '',
    password: '', confirm: '', telephone: '',
    dateNaissance: '', nss: ''
  });
  const [error, setError] = useState('');
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setError('');
    setDetails([]);
    setLoading(true);

    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        email: form.email,
        password: form.password,
        role: 'patient',
        prenom: form.prenom,
        nom: form.nom,
        telephone: form.telephone,
        dateNaissance: form.dateNaissance,
        nss: form.nss
      });
      navigation.replace('PatientTabs');
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
      setDetails(err.response?.data?.details || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>



      {/* HEADER */}
     <View style={styles.logoCircle}>
       <Text style={styles.logoCross}>✚</Text>
     </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Inscription</Text>
        <Text style={styles.cardSub}>Creez votre espace patient</Text>

        {/* NOM PRENOM */}
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>PRENOM</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Jean"
                placeholderTextColor="#b0bec5"
                onChangeText={(v) => handleChange('prenom', v)}
              />
            </View>
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>NOM</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Dupont"
                placeholderTextColor="#b0bec5"
                onChangeText={(v) => handleChange('nom', v)}
              />
            </View>
          </View>
        </View>

        <Text style={styles.label}>ADRESSE EMAIL</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={18} color="#8a99b3" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="exemple@medica.fr"
            placeholderTextColor="#b0bec5"
            onChangeText={(v) => handleChange('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.label}>TELEPHONE</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="call-outline" size={18} color="#8a99b3" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="+33 6 00 00 00 00"
            placeholderTextColor="#b0bec5"
            onChangeText={(v) => handleChange('telephone', v)}
            keyboardType="phone-pad"
          />
        </View>

        <Text style={styles.label}>DATE DE NAISSANCE</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="calendar-outline" size={18} color="#8a99b3" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="JJ/MM/AAAA"
            placeholderTextColor="#b0bec5"
            onChangeText={(v) => handleChange('dateNaissance', v)}
          />
        </View>

        <Text style={styles.label}>NUMERO DE SECURITE SOCIALE</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="card-outline" size={18} color="#8a99b3" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="1 85 05 75 108 001 48"
            placeholderTextColor="#b0bec5"
            onChangeText={(v) => handleChange('nss', v)}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.label}>MOT DE PASSE</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={18} color="#8a99b3" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#b0bec5"
            onChangeText={(v) => handleChange('password', v)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18} color="#8a99b3" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>CONFIRMER LE MOT DE PASSE</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={18} color="#8a99b3" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#b0bec5"
            onChangeText={(v) => handleChange('confirm', v)}
            secureTextEntry={!showConfirm}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons
              name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
              size={18} color="#8a99b3" />
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color="#e74c3c" style={{ marginRight: 6 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.errorText}>{error}</Text>
              {details.map((d, i) => (
                <Text key={i} style={styles.errorDetail}>• {d}</Text>
              ))}
            </View>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>CREER MON COMPTE</Text>
          }
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Deja un compte ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.secure}>
        Connexion securisee — donnees chiffrees
      </Text>

    </ScrollView>
  );
};





const styles = StyleSheet.create({
  container: {
    flexGrow: 1, backgroundColor: '#f0f4ff',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  header: { alignItems: 'center', marginBottom: 32 },
logoCircle: {
  width: 70, height: 70, backgroundColor: '#4f8ef7',
  borderRadius: 35, alignItems: 'center',
  justifyContent: 'center', marginBottom: 12,
  shadowColor: '#4f8ef7', shadowOpacity: 0.4,
  shadowRadius: 12, elevation: 6
},
logoCross: {
  color: '#fff',
  fontSize: 36,
  fontWeight: '900',
},
  logoText: {
    fontSize: 28, fontWeight: '700',
    color: '#1a2340', letterSpacing: 3
  },
  logoPlus: { color: '#4f8ef7' },
  logoSub: { fontSize: 11, color: '#8a99b3', letterSpacing: 4, marginTop: 4 },

  card: {
    width: '100%', backgroundColor: '#fff',
    borderRadius: 20, padding: 24,
    shadowColor: '#000', shadowOpacity: 0.08,
    shadowRadius: 16, elevation: 4
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#1a2340', marginBottom: 6 },
  cardSub: { fontSize: 13, color: '#8a99b3', marginBottom: 16 },

  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },

  label: {
    fontSize: 11, color: '#8a99b3',
    letterSpacing: 2, marginBottom: 8, marginTop: 16
  },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f7f9ff', borderRadius: 10,
    borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 12
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1, padding: 12,
    color: '#1a2340', fontSize: 14
  },

  errorBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#fdf0f0', borderRadius: 10,
    borderWidth: 1, borderColor: '#fcc', padding: 10, marginTop: 16
  },
  errorText: { color: '#e74c3c', fontSize: 13 },
  errorDetail: { color: '#e74c3c', fontSize: 12, marginTop: 4 },

  button: {
    backgroundColor: '#4f8ef7', borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 24
  },
  buttonDisabled: { backgroundColor: '#a8c7fa' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 1 },

  loginRow: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', marginTop: 20
  },
  loginText: { color: '#8a99b3', fontSize: 13 },
  loginLink: { color: '#4f8ef7', fontSize: 13, fontWeight: '600' },

  secure: { color: '#8a99b3', fontSize: 12, marginTop: 24, marginBottom: 10 },
});

export default Register;