import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Modal
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../services/api';

const Ordonnances = () => {
  const [ordonnances, setOrdonnances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailModal, setDetailModal] = useState(false);

  useEffect(() => {
    fetchOrdonnances();
  }, []);

  const fetchOrdonnances = async () => {
    setLoading(true);
    try {
      const response = await api.get('/ordonnances');
      setOrdonnances(response.data);
    } catch (err) {
      // données fictives pour l'instant
      setOrdonnances([
        {
          id: '1',
          date: '2026-06-10',
          medecin: { prenom: 'Martin', nom: 'Dupont', specialite: 'Medecin generaliste' },
          contenu: 'Doliprane 1000mg - 1 comprime 3x par jour pendant 5 jours\nAmoxicilline 500mg - 1 gelule 3x par jour pendant 7 jours'
        },
        {
          id: '2',
          date: '2026-05-20',
          medecin: { prenom: 'Leblanc', nom: 'Sophie', specialite: 'Cardiologue' },
          contenu: 'Bisoprolol 5mg - 1 comprime le matin\nRamipril 5mg - 1 comprime le soir'
        },
        {
          id: '3',
          date: '2026-04-15',
          medecin: { prenom: 'Durand', nom: 'Pierre', specialite: 'Dermatologue' },
          contenu: 'Creme Hydrocortisone 1% - Appliquer 2x par jour sur les zones concernees'
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const getMedicaments = (contenu) => {
    return contenu.split('\n').filter(line => line.trim() !== '');
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Ordonnances</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{ordonnances.length}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f8ef7" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {ordonnances.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color="#c8d5e8" />
              <Text style={styles.emptyText}>Aucune ordonnance</Text>
            </View>
          ) : (
            ordonnances.map((ord) => (
              <TouchableOpacity
                key={ord.id}
                style={styles.ordCard}
                onPress={() => { setSelected(ord); setDetailModal(true); }}>

                <View style={styles.ordLeft}>
                  <View style={styles.ordIconBox}>
                    <MaterialCommunityIcons name="pill" size={22} color="#4f8ef7" />
                  </View>
                </View>

                <View style={styles.ordInfo}>
                  <Text style={styles.ordDoctor}>
                    Dr. {ord.medecin.prenom} {ord.medecin.nom}
                  </Text>
                  <Text style={styles.ordSpec}>{ord.medecin.specialite}</Text>
                  <View style={styles.ordRow}>
                    <Ionicons name="calendar-outline" size={12} color="#8a99b3" style={{ marginRight: 4 }} />
                    <Text style={styles.ordDate}>{formatDate(ord.date)}</Text>
                  </View>
                  <Text style={styles.ordMedCount}>
                    {getMedicaments(ord.contenu).length} medicament(s)
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#c8d5e8" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {/* MODAL DETAIL */}
      <Modal visible={detailModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Ordonnance</Text>
                {selected && (
                  <Text style={styles.modalSub}>{formatDate(selected.date)}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => setDetailModal(false)}>
                <Ionicons name="close" size={24} color="#1a2340" />
              </TouchableOpacity>
            </View>

            {selected && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalDoctorCard}>
                  <View style={styles.modalDoctorAvatar}>
                    <Ionicons name="person" size={20} color="#4f8ef7" />
                  </View>
                  <View>
                    <Text style={styles.modalDoctorName}>
                      Dr. {selected.medecin.prenom} {selected.medecin.nom}
                    </Text>
                    <Text style={styles.modalDoctorSpec}>{selected.medecin.specialite}</Text>
                  </View>
                </View>

                <Text style={styles.modalSectionTitle}>MEDICAMENTS PRESCRITS</Text>
                {getMedicaments(selected.contenu).map((med, index) => (
                  <View key={index} style={styles.medCard}>
                    <View style={styles.medIconBox}>
                      <MaterialCommunityIcons name="pill" size={18} color="#f7934f" />
                    </View>
                    <Text style={styles.medText}>{med}</Text>
                  </View>
                ))}

                <TouchableOpacity style={styles.downloadBtn}>
                  <Ionicons name="download-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.downloadBtnText}>TELECHARGER EN PDF</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 55, paddingBottom: 20
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1a2340', marginRight: 10 },
  headerBadge: {
    backgroundColor: '#4f8ef7', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 3
  },
  headerBadgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  loadingText: { color: '#8a99b3', marginTop: 12, fontSize: 14 },
  list: { paddingHorizontal: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#8a99b3', fontSize: 16, marginTop: 12 },

  ordCard: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 16, flexDirection: 'row',
    alignItems: 'center', marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, elevation: 2
  },
  ordLeft: { marginRight: 14 },
  ordIconBox: {
    width: 46, height: 46, backgroundColor: '#eef3ff',
    borderRadius: 23, alignItems: 'center', justifyContent: 'center'
  },
  ordInfo: { flex: 1 },
  ordDoctor: { color: '#1a2340', fontSize: 14, fontWeight: '600', marginBottom: 3 },
  ordSpec: { color: '#8a99b3', fontSize: 12, marginBottom: 4 },
  ordRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ordDate: { color: '#8a99b3', fontSize: 12 },
  ordMedCount: { color: '#4f8ef7', fontSize: 12, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff', borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24, maxHeight: '85%'
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 20
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1a2340' },
  modalSub: { color: '#8a99b3', fontSize: 13, marginTop: 4 },
  modalDoctorCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f0f4ff', borderRadius: 12,
    padding: 14, marginBottom: 20
  },
  modalDoctorAvatar: {
    width: 40, height: 40, backgroundColor: '#eef3ff',
    borderRadius: 20, alignItems: 'center',
    justifyContent: 'center', marginRight: 12
  },
  modalDoctorName: { color: '#1a2340', fontSize: 14, fontWeight: '600' },
  modalDoctorSpec: { color: '#8a99b3', fontSize: 12, marginTop: 2 },
  modalSectionTitle: {
    fontSize: 11, color: '#8a99b3',
    letterSpacing: 2, marginBottom: 12, fontWeight: '600'
  },
  medCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#fff5ee', borderRadius: 10,
    padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: '#ffe8d6'
  },
  medIconBox: { marginRight: 10, marginTop: 2 },
  medText: { color: '#1a2340', fontSize: 13, flex: 1, lineHeight: 20 },
  downloadBtn: {
    backgroundColor: '#4f8ef7', borderRadius: 12,
    padding: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 20, marginBottom: 10
  },
  downloadBtnText: { color: '#fff', fontSize: 13, fontWeight: '700', letterSpacing: 1 },
});

export default Ordonnances;