import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

const handleLogin = async () => {
  setError('');
  setLoading(true);
  try {
    const response = await api.post('/auth/login', {
      email, password, role: 'patient'
    });
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('role', response.data.role);
    navigation.replace('PatientTabs');
  } catch (err) {
    setError(err.response?.data?.error || 'Email ou mot de passe incorrect');
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>


      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
  <Text style={styles.logoCross}>✚</Text>
</View>
        <Text style={styles.logoText}>MEDICA<Text style={styles.logoPlus}>+</Text></Text>
        <Text style={styles.logoSub}>HEALTH PLATFORM</Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Connexion</Text>
        <Text style={styles.cardSub}>Connectez-vous a votre espace patient</Text>

        <Text style={styles.label}>ADRESSE EMAIL</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={18} color="#8a99b3" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="exemple@medica.fr"
            placeholderTextColor="#b0bec5"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.label}>MOT DE PASSE</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={18} color="#8a99b3" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#b0bec5"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18} color="#8a99b3" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotRow}>
          <Text style={styles.forgotText}>Mot de passe oublie ?</Text>
        </TouchableOpacity>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color="#e74c3c" style={{ marginRight: 6 }} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>SE CONNECTER</Text>
          }
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Pas encore de compte ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>S'inscrire</Text>
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
  cardSub: { fontSize: 13, color: '#8a99b3', marginBottom: 24 },

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

  forgotRow: { alignItems: 'flex-end', marginTop: 8 },
  forgotText: { color: '#4f8ef7', fontSize: 13 },

  errorBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fdf0f0', borderRadius: 10,
    borderWidth: 1, borderColor: '#fcc', padding: 10, marginTop: 12
  },
  errorText: { color: '#e74c3c', fontSize: 13, flex: 1 },

  button: {
    backgroundColor: '#4f8ef7', borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 24
  },
  buttonDisabled: { backgroundColor: '#a8c7fa' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 1 },

  registerRow: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', marginTop: 20
  },
  registerText: { color: '#8a99b3', fontSize: 13 },
  registerLink: { color: '#4f8ef7', fontSize: 13, fontWeight: '600' },

  secure: { color: '#8a99b3', fontSize: 12, marginTop: 24 },
});

export default Login;