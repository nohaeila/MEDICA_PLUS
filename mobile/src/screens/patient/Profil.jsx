import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, Modal, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

const Profil = ({ navigation }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const [editTelephone, setEditTelephone] = useState('');
  const [editMedecinTraitant, setEditMedecinTraitant] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    setLoading(true);
    try {
      const response = await api.get('/profil');
      setPatient(response.data);
      setEditEmail(response.data.email);
      setEditTelephone(response.data.telephone);
      setEditMedecinTraitant(response.data.medecinTraitant || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/profil', {
        email: editEmail,
        telephone: editTelephone,
        medecinTraitant: editMedecinTraitant
      });
      setPatient({ ...patient, email: editEmail, telephone: editTelephone, medecinTraitant: editMedecinTraitant });
      setEditModal(false);
      Alert.alert('Succes', 'Profil mis a jour avec succes');
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de mettre a jour le profil');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Deconnexion',
      'Voulez-vous vraiment vous deconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se deconnecter',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('role');
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Non renseigne';
    return dateStr;
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Profil</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setEditModal(true)}>
          <Ionicons name="create-outline" size={22} color="#4f8ef7" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f8ef7" />
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

          {/* AVATAR */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {patient?.prenom?.[0]}{patient?.nom?.[0]}
              </Text>
            </View>
            <Text style={styles.avatarName}>{patient?.prenom} {patient?.nom}</Text>
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}>PATIENT ACTIF</Text>
            </View>
          </View>

          {/* INFOS PERSONNELLES */}
          <Text style={styles.sectionLabel}>INFORMATIONS PERSONNELLES</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="person-outline" size={18} color="#4f8ef7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>NOM COMPLET</Text>
                <Text style={styles.infoValue}>{patient?.prenom} {patient?.nom}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="mail-outline" size={18} color="#4f8ef7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>EMAIL</Text>
                <Text style={styles.infoValue}>{patient?.email}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="call-outline" size={18} color="#4f8ef7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>TELEPHONE</Text>
                <Text style={styles.infoValue}>{patient?.telephone}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="calendar-outline" size={18} color="#4f8ef7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>DATE DE NAISSANCE</Text>
                <Text style={styles.infoValue}>{formatDate(patient?.dateNaissance)}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="card-outline" size={18} color="#4f8ef7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>NUMERO DE SECURITE SOCIALE</Text>
                <Text style={styles.infoValue}>{patient?.nss}</Text>
              </View>
            </View>
          </View>

          {/* MEDECIN TRAITANT */}
          <Text style={styles.sectionLabel}>MEDECIN TRAITANT</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="medical-outline" size={18} color="#4f8ef7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>MEDECIN TRAITANT</Text>
                <Text style={styles.infoValue}>
                  {patient?.medecinTraitant || 'Non renseigne'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setEditModal(true)}>
                <Ionicons name="create-outline" size={18} color="#8a99b3" />
              </TouchableOpacity>
            </View>
          </View>

          {/* DECONNEXION */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#e74c3c" style={{ marginRight: 10 }} />
            <Text style={styles.logoutText}>Se deconnecter</Text>
          </TouchableOpacity>

          <Text style={styles.version}>MEDICA+ v1.0.0</Text>

        </ScrollView>
      )}

      {/* MODAL EDITION */}
      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier mes informations</Text>
              <TouchableOpacity onPress={() => setEditModal(false)}>
                <Ionicons name="close" size={24} color="#1a2340" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>ADRESSE EMAIL</Text>
            <View style={styles.modalInput}>
              <Ionicons name="mail-outline" size={18} color="#8a99b3" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.modalInputText}
                value={editEmail}
                onChangeText={setEditEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Text style={styles.modalLabel}>TELEPHONE</Text>
            <View style={styles.modalInput}>
              <Ionicons name="call-outline" size={18} color="#8a99b3" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.modalInputText}
                value={editTelephone}
                onChangeText={setEditTelephone}
                keyboardType="phone-pad"
              />
            </View>

            <Text style={styles.modalLabel}>MEDECIN TRAITANT</Text>
            <View style={styles.modalInput}>
              <Ionicons name="medical-outline" size={18} color="#8a99b3" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.modalInputText}
                value={editMedecinTraitant}
                onChangeText={setEditMedecinTraitant}
                placeholder="Dr. Nom Prenom"
                placeholderTextColor="#b0bec5"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}>
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.saveBtnText}>ENREGISTRER</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20,
    paddingTop: 55, paddingBottom: 20
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1a2340' },
  editBtn: {
    width: 40, height: 40, backgroundColor: '#eef3ff',
    borderRadius: 20, alignItems: 'center', justifyContent: 'center'
  },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20 },

  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 80, height: 80, backgroundColor: '#4f8ef7',
    borderRadius: 40, alignItems: 'center',
    justifyContent: 'center', marginBottom: 12
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  avatarName: { color: '#1a2340', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  avatarBadge: {
    backgroundColor: '#eafaf1', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 4,
    borderWidth: 1, borderColor: '#b7e4c7'
  },
  avatarBadgeText: { color: '#27ae60', fontSize: 11, fontWeight: '700', letterSpacing: 1 },

  sectionLabel: {
    fontSize: 11, color: '#8a99b3',
    letterSpacing: 2, marginBottom: 10, fontWeight: '600'
  },
  card: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 16, marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, elevation: 2
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  infoIconBox: {
    width: 36, height: 36, backgroundColor: '#eef3ff',
    borderRadius: 18, alignItems: 'center',
    justifyContent: 'center', marginRight: 14
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 10, color: '#8a99b3', letterSpacing: 2, marginBottom: 4 },
  infoValue: { fontSize: 14, color: '#1a2340', fontWeight: '500' },
  divider: { height: 0.5, backgroundColor: '#e2e8f0', marginVertical: 2 },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#fdf0f0',
    borderRadius: 14, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#fcc'
  },
  logoutText: { color: '#e74c3c', fontSize: 15, fontWeight: '600' },
  version: { color: '#c8d5e8', fontSize: 12, textAlign: 'center', marginBottom: 40 },

  modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff', borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1a2340' },
  modalLabel: {
    fontSize: 11, color: '#8a99b3',
    letterSpacing: 2, marginBottom: 8, marginTop: 16
  },
  modalInput: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f7f9ff', borderRadius: 10,
    borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 12
  },
  modalInputText: { flex: 1, padding: 12, color: '#1a2340', fontSize: 14 },
  saveBtn: {
    backgroundColor: '#4f8ef7', borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 24
  },
  saveBtnDisabled: { backgroundColor: '#a8c7fa' },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
});

export default Profil;