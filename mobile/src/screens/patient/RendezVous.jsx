import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, Modal, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const RendezVous = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [rdvs, setRdvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [editHeure, setEditHeure] = useState('');
  const [saving, setSaving] = useState(false);

  const horaires = ['09h00', '09h30', '10h00', '10h30', '11h00', '11h30',
    '14h00', '14h30', '15h00', '15h30', '16h00', '16h30'];

  useEffect(() => {
    fetchRdvs();
  }, []);

  const fetchRdvs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/rdv');
      setRdvs(response.data);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de charger les RDV');
    } finally {
      setLoading(false);
    }
  };

  const isUpcoming = (date) => {
    return new Date(date) >= new Date();
  };

  const getStatutStyle = (statut) => {
    if (statut === 'confirme') return { bg: '#eafaf1', color: '#27ae60', label: 'Confirme' };
    if (statut === 'en_attente') return { bg: '#fff8e1', color: '#f39c12', label: 'En attente' };
    return { bg: '#f5f5f5', color: '#8a99b3', label: 'Termine' };
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const months = ['JAN', 'FEV', 'MAR', 'AVR', 'MAI', 'JUN',
      'JUL', 'AOU', 'SEP', 'OCT', 'NOV', 'DEC'];
    return {
      day: String(date.getDate()).padStart(2, '0'),
      month: months[date.getMonth()]
    };
  };

  const handleDelete = (rdv) => {
    Alert.alert(
      'Supprimer le RDV',
      `Voulez-vous vraiment supprimer ce RDV avec Dr. ${rdv.medecin.prenom} ${rdv.medecin.nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/rdv/${rdv.id}`);
              setRdvs(rdvs.filter(r => r.id !== rdv.id));
            } catch (err) {
              Alert.alert('Erreur', 'Impossible de supprimer le RDV');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (rdv) => {
    setSelectedRdv(rdv);
    setEditHeure(rdv.heure);
    setEditModal(true);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await api.put(`/rdv/${selectedRdv.id}`, {
        date: selectedRdv.date,
        heure: editHeure,
        motif: selectedRdv.motif
      });
      setRdvs(rdvs.map(r => r.id === selectedRdv.id ? { ...r, heure: editHeure } : r));
      setEditModal(false);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de modifier le RDV');
    } finally {
      setSaving(false);
    }
  };

  const upcoming = rdvs.filter(r => isUpcoming(r.date));
  const past = rdvs.filter(r => !isUpcoming(r.date));
  const data = activeTab === 'upcoming' ? upcoming : past;

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Rendez-vous</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('PriseRDV')}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}>
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
            A venir ({upcoming.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}>
          <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
            Passes ({past.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f8ef7" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {data.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color="#c8d5e8" />
              <Text style={styles.emptyText}>Aucun rendez-vous</Text>

            </View>
          ) : (
            data.map((rdv) => {
              const statut = getStatutStyle(rdv.statut);
              const { day, month } = formatDate(rdv.date);
              return (
                <View key={rdv.id} style={styles.rdvCard}>
                  <View style={styles.rdvDateBox}>
                    <Text style={styles.rdvDate}>{day}</Text>
                    <Text style={styles.rdvMonth}>{month}</Text>
                  </View>
                  <View style={styles.rdvInfo}>
                    <Text style={styles.rdvDoctor}>
                      Dr. {rdv.medecin.prenom} {rdv.medecin.nom}
                    </Text>
                    <Text style={styles.rdvSpec}>{rdv.medecin.specialite}</Text>
                    <View style={styles.rdvRow}>
                      <Ionicons name="time-outline" size={13} color="#8a99b3" style={{ marginRight: 4 }} />
                      <Text style={styles.rdvHeure}>{rdv.heure}</Text>
                    </View>
                    <View style={[styles.statutBadge, { backgroundColor: statut.bg, alignSelf: 'flex-start', marginTop: 6 }]}>
                      <Text style={[styles.statutText, { color: statut.color }]}>{statut.label}</Text>
                    </View>
                  </View>

                  {activeTab === 'upcoming' && (
                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => handleEdit(rdv)}>
                        <Ionicons name="create-outline" size={18} color="#4f8ef7" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDelete(rdv)}>
                        <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}


        </ScrollView>
      )}

      {/* MODAL EDITION */}
      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier le RDV</Text>
              <TouchableOpacity onPress={() => setEditModal(false)}>
                <Ionicons name="close" size={24} color="#1a2340" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>CHOISISSEZ UNE NOUVELLE HEURE</Text>
            <View style={styles.horaireGrid}>
              {horaires.map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[styles.horaireBtn, editHeure === h && styles.horaireBtnActive]}
                  onPress={() => setEditHeure(h)}>
                  <Text style={[styles.horaireText, editHeure === h && styles.horaireTextActive]}>
                    {h}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSaveEdit}
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
  addBtn: {
    width: 40, height: 40, backgroundColor: '#4f8ef7',
    borderRadius: 20, alignItems: 'center', justifyContent: 'center'
  },
  tabs: {
    flexDirection: 'row', marginHorizontal: 20,
    backgroundColor: '#e8edf7', borderRadius: 12,
    padding: 4, marginBottom: 20
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#fff' },
  tabText: { color: '#8a99b3', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#1a2340' },
  list: { paddingHorizontal: 20 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  loadingText: { color: '#8a99b3', marginTop: 12, fontSize: 14 },
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 20 },
  emptyText: { color: '#8a99b3', fontSize: 16, marginTop: 12, marginBottom: 20 },
  emptyBtn: { backgroundColor: '#4f8ef7', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  emptyBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  rdvCard: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 16, flexDirection: 'row',
    alignItems: 'center', marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, elevation: 2
  },
  rdvDateBox: {
    backgroundColor: '#eef3ff', borderRadius: 10,
    padding: 12, alignItems: 'center', marginRight: 14, minWidth: 50
  },
  rdvDate: { color: '#4f8ef7', fontSize: 20, fontWeight: '700' },
  rdvMonth: { color: '#8a99b3', fontSize: 10, letterSpacing: 1 },
  rdvInfo: { flex: 1 },
  rdvDoctor: { color: '#1a2340', fontSize: 14, fontWeight: '600', marginBottom: 3 },
  rdvSpec: { color: '#8a99b3', fontSize: 12, marginBottom: 4 },
  rdvRow: { flexDirection: 'row', alignItems: 'center' },
  rdvHeure: { color: '#8a99b3', fontSize: 11 },
  statutBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  statutText: { fontSize: 11, fontWeight: '600' },
  actions: { flexDirection: 'column', gap: 8, marginLeft: 8 },
  editBtn: {
    width: 34, height: 34, backgroundColor: '#eef3ff',
    borderRadius: 17, alignItems: 'center', justifyContent: 'center'
  },
  deleteBtn: {
    width: 34, height: 34, backgroundColor: '#fdf0f0',
    borderRadius: 17, alignItems: 'center', justifyContent: 'center'
  },
  newRdvBtn: {
    backgroundColor: '#1a2340', borderRadius: 12,
    padding: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 8, marginBottom: 30
  },
  newRdvBtnText: { color: '#fff', fontSize: 13, fontWeight: '600', letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1a2340' },
  modalLabel: { fontSize: 11, color: '#8a99b3', letterSpacing: 2, marginBottom: 12 },
  horaireGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  horaireBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: '#f7f9ff', borderRadius: 10,
    borderWidth: 1, borderColor: '#e2e8f0'
  },
  horaireBtnActive: { backgroundColor: '#4f8ef7', borderColor: '#4f8ef7' },
  horaireText: { color: '#1a2340', fontSize: 13 },
  horaireTextActive: { color: '#fff' },
  saveBtn: { backgroundColor: '#4f8ef7', borderRadius: 12, padding: 16, alignItems: 'center' },
  saveBtnDisabled: { backgroundColor: '#a8c7fa' },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
});

export default RendezVous;