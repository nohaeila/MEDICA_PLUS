import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const ResetPassword = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [nss, setNss] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setError('');
    if (!email || !nss) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    setStep(2);
  };

  const handleReset = async () => {
    setError('');
    setDetails([]);
    if (newPassword !== confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, nss, newPassword });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
      setDetails(err.response?.data?.details || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => step === 1 ? navigation.goBack() : setStep(step - 1)}>
          <Ionicons name="arrow-back" size={24} color="#1a2340" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mot de passe oublié</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.card}>

        {/* STEP 1 — VERIFICATION IDENTITE */}
        {step === 1 && (
          <>
            <View style={styles.infoBox}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#4f8ef7" style={{ marginRight: 10 }} />
              <Text style={styles.infoText}>
                Saisissez votre email et votre numéro de sécurité sociale pour vérifier votre identité.
              </Text>
            </View>

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

            <Text style={styles.label}>NUMÉRO DE SÉCURITÉ SOCIALE</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={18} color="#8a99b3" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="1 85 05 75 108 001 48"
                placeholderTextColor="#b0bec5"
                value={nss}
                onChangeText={setNss}
                keyboardType="numeric"
              />
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color="#e74c3c" style={{ marginRight: 6 }} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={handleVerify}>
              <Text style={styles.buttonText}>VÉRIFIER MON IDENTITÉ</Text>
            </TouchableOpacity>
          </>
        )}

        {/* STEP 2 — NOUVEAU MOT DE PASSE */}
        {step === 2 && (
          <>
            <View style={styles.infoBox}>
              <Ionicons name="lock-open-outline" size={18} color="#4f8ef7" style={{ marginRight: 10 }} />
              <Text style={styles.infoText}>
                Choisissez un nouveau mot de passe sécurisé.
              </Text>
            </View>

            <Text style={styles.label}>NOUVEAU MOT DE PASSE</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#8a99b3" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#b0bec5"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="oneTimeCode"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#8a99b3" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>CONFIRMER LE MOT DE PASSE</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#8a99b3" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#b0bec5"
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="oneTimeCode"
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={18} color="#8a99b3" />
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
              onPress={handleReset}
              disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>RÉINITIALISER</Text>
              }
            </TouchableOpacity>
          </>
        )}

        {/* STEP 3 — SUCCES */}
        {step === 3 && (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={60} color="#27ae60" />
            </View>
            <Text style={styles.successTitle}>Mot de passe réinitialisé !</Text>
            <Text style={styles.successText}>
              Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.replace('Login')}>
              <Text style={styles.buttonText}>SE CONNECTER</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, backgroundColor: '#f0f4ff',
    padding: 24
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 24, marginTop: 30
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1a2340' },
  card: {
    backgroundColor: '#fff', borderRadius: 20,
    padding: 24, shadowColor: '#000',
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 4
  },
  infoBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#eef3ff', borderRadius: 12,
    padding: 14, marginBottom: 20,
    borderWidth: 1, borderColor: '#d0e4ff'
  },
  infoText: { color: '#4a6fa5', fontSize: 12, flex: 1, lineHeight: 18 },
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
  input: { flex: 1, padding: 12, color: '#1a2340', fontSize: 14 },
  errorBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#fdf0f0', borderRadius: 10,
    borderWidth: 1, borderColor: '#fcc',
    padding: 10, marginTop: 16
  },
  errorText: { color: '#e74c3c', fontSize: 13 },
  errorDetail: { color: '#e74c3c', fontSize: 12, marginTop: 4 },
  button: {
    backgroundColor: '#4f8ef7', borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 24
  },
  buttonDisabled: { backgroundColor: '#a8c7fa' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 1 },
  successContainer: { alignItems: 'center', paddingVertical: 20 },
  successIcon: { marginBottom: 20 },
  successTitle: { fontSize: 20, fontWeight: '700', color: '#1a2340', marginBottom: 12 },
  successText: {
    color: '#8a99b3', fontSize: 14, textAlign: 'center',
    lineHeight: 22, marginBottom: 8
  },
});

export default ResetPassword;