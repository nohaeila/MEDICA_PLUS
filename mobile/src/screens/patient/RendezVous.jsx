import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RendezVous = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const rdvs = [
    {
      id: 1, doctor: 'Dr. Martin', spec: 'Medecin generaliste',
      date: '15', month: 'JUL', heure: '10h30', lieu: 'Paris 8e', statut: 'confirme'
    },
    {
      id: 2, doctor: 'Dr. Leblanc', spec: 'Cardiologue',
      date: '22', month: 'JUL', heure: '14h00', lieu: 'Paris 15e', statut: 'en_attente'
    },
    {
      id: 3, doctor: 'Dr. Durand', spec: 'Dermatologue',
      date: '05', month: 'AOU', heure: '09h00', lieu: 'Paris 11e', statut: 'confirme'
    },
  ];

  const rdvsPasses = [
    {
      id: 4, doctor: 'Dr. Martin', spec: 'Medecin generaliste',
      date: '10', month: 'JUN', heure: '11h00', lieu: 'Paris 8e', statut: 'termine'
    },
    {
      id: 5, doctor: 'Dr. Leblanc', spec: 'Cardiologue',
      date: '02', month: 'JUN', heure: '15h30', lieu: 'Paris 15e', statut: 'termine'
    },
  ];

  const getStatutStyle = (statut) => {
    if (statut === 'confirme') return { bg: '#eafaf1', color: '#27ae60', label: 'Confirme' };
    if (statut === 'en_attente') return { bg: '#fff8e1', color: '#f39c12', label: 'En attente' };
    return { bg: '#f5f5f5', color: '#8a99b3', label: 'Termine' };
  };

  const data = activeTab === 'upcoming' ? rdvs : rdvsPasses;

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Rendez-vous</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}>
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
            A venir
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}>
          <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
            Passes
          </Text>
        </TouchableOpacity>
      </View>

      {/* LISTE */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {data.map((rdv) => {
          const statut = getStatutStyle(rdv.statut);
          return (
            <View key={rdv.id} style={styles.rdvCard}>
              <View style={styles.rdvDateBox}>
                <Text style={styles.rdvDate}>{rdv.date}</Text>
                <Text style={styles.rdvMonth}>{rdv.month}</Text>
              </View>
              <View style={styles.rdvInfo}>
                <Text style={styles.rdvDoctor}>{rdv.doctor}</Text>
                <Text style={styles.rdvSpec}>{rdv.spec}</Text>
                <View style={styles.rdvRow}>
                  <Ionicons name="time-outline" size={13} color="#8a99b3" style={{ marginRight: 4 }} />
                  <Text style={styles.rdvHeure}>{rdv.heure}</Text>
                  <Ionicons name="location-outline" size={13} color="#8a99b3" style={{ marginLeft: 10, marginRight: 4 }} />
                  <Text style={styles.rdvHeure}>{rdv.lieu}</Text>
                </View>
              </View>
              <View style={[styles.statutBadge, { backgroundColor: statut.bg }]}>
                <Text style={[styles.statutText, { color: statut.color }]}>{statut.label}</Text>
              </View>
            </View>
          );
        })}

        {/* BOUTON PRENDRE RDV */}
        <TouchableOpacity style={styles.newRdvBtn} onPress={() => navigation.navigate('PriseRDV')}>
          <Ionicons name="calendar-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.newRdvBtnText}>PRENDRE UN RENDEZ-VOUS</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20,
    paddingTop: 55, paddingBottom: 20, backgroundColor: '#f0f4ff'
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
  tab: {
    flex: 1, paddingVertical: 10,
    alignItems: 'center', borderRadius: 10
  },
  tabActive: { backgroundColor: '#fff' },
  tabText: { color: '#8a99b3', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#1a2340' },

  list: { paddingHorizontal: 20 },

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
  rdvSpec: { color: '#8a99b3', fontSize: 12, marginBottom: 6 },
  rdvRow: { flexDirection: 'row', alignItems: 'center' },
  rdvHeure: { color: '#8a99b3', fontSize: 11 },
  statutBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  statutText: { fontSize: 11, fontWeight: '600' },

  newRdvBtn: {
    backgroundColor: '#1a2340', borderRadius: 12,
    padding: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 8, marginBottom: 30
  },
  newRdvBtnText: { color: '#fff', fontSize: 13, fontWeight: '600', letterSpacing: 1 },
});

export default RendezVous;