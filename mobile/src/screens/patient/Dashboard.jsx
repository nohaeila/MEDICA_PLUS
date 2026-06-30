import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../services/api';

const conseils = [
  'Pensez a boire au moins 1,5L d\'eau par jour pour rester hydrate.',
  'Une activite physique de 30 minutes par jour reduit le risque cardiovasculaire.',
  'Dormez entre 7 et 9 heures par nuit pour un meilleur systeme immunitaire.',
  'Evitez de rester assis plus de 2 heures consecutives sans faire une pause.',
  'Consommez 5 fruits et legumes par jour pour couvrir vos besoins en vitamines.',
];

const Dashboard = ({ navigation }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [patient, setPatient] = useState(null);
  const [prochainRdv, setProchainRdv] = useState(null);
  const [rdvCount, setRdvCount] = useState(0);
  const [ordonnancesCount, setOrdonnancesCount] = useState(0);
  const conseil = conseils[new Date().getDay() % conseils.length];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profilRes, notifRes, rdvRes, ordRes] = await Promise.all([
        api.get('/profil'),
        api.get('/notifications'),
        api.get('/rdv'),
        api.get('/ordonnances'),
      ]);

      setPatient(profilRes.data);
      setUnreadCount(notifRes.data.filter(n => !n.lu).length);

      const today = new Date();
      const upcoming = rdvRes.data
        .filter(r => new Date(r.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setRdvCount(upcoming.length);
      setProchainRdv(upcoming[0] || null);
      setOrdonnancesCount(ordRes.data.length);
    } catch (err) {
      console.error(err);
    }
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

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Bonjour,</Text>
          <Text style={styles.headerName}>{patient?.prenom} {patient?.nom}</Text>
        </View>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={20} color="#fff" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* CARTE HERO */}
      <View style={styles.heroCard}>
        <View>
          <Text style={styles.heroLabel}>DOSSIER PATIENT</Text>
          <Text style={styles.heroName}>{patient?.prenom} {patient?.nom}</Text>
          <Text style={styles.heroNss}>NSS : {patient?.nss}</Text>
          <View style={styles.heroRow}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>ACTIF</Text>
            </View>
          </View>
        </View>
        <View style={styles.heroCircle}>
          <Text style={styles.heroInitials}>
            {patient?.prenom?.[0]}{patient?.nom?.[0]}
          </Text>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={20} color="#4f8ef7" />
          <Text style={styles.statValue}>{rdvCount}</Text>
          <Text style={styles.statLabel}>RDV a venir</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="pill" size={20} color="#f7934f" />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Traitements</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="document-text" size={20} color="#4fc9f7" />
          <Text style={styles.statValue}>{ordonnancesCount}</Text>
          <Text style={styles.statLabel}>Ordonnances</Text>
        </View>
      </View>

      {/* BOUTON RDV */}
      <TouchableOpacity
        style={styles.rdvBtn}
        onPress={() => navigation.navigate('PriseRDV')}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.rdvBtnText}>PRENDRE UN RENDEZ-VOUS</Text>
      </TouchableOpacity>

      {/* PROCHAIN RDV */}
      <Text style={styles.sectionTitle}>PROCHAIN RENDEZ-VOUS</Text>
      {prochainRdv ? (
        <View style={styles.rdvCard}>
          <View style={styles.rdvDateBox}>
            <Text style={styles.rdvDate}>{formatDate(prochainRdv.date).day}</Text>
            <Text style={styles.rdvMonth}>{formatDate(prochainRdv.date).month}</Text>
          </View>
          <View style={styles.rdvInfo}>
            <Text style={styles.rdvDoctor}>
              Dr. {prochainRdv.medecin.prenom} {prochainRdv.medecin.nom}
            </Text>
            <Text style={styles.rdvSpec}>{prochainRdv.medecin.specialite}</Text>
            <View style={styles.rdvTimeRow}>
              <Ionicons name="time-outline" size={13} color="#4f8ef7" style={{ marginRight: 4 }} />
              <Text style={styles.rdvTime}>{prochainRdv.heure}</Text>
            </View>
          </View>
          <View style={styles.rdvStatusBadge}>
            <Text style={styles.rdvStatusText}>Confirme</Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptyRdv}>
          <Text style={styles.emptyRdvText}>Aucun RDV a venir</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PriseRDV')}>
          </TouchableOpacity>
        </View>
      )}

      {/* CONSEIL */}
      <Text style={styles.sectionTitle}>CONSEIL DU JOUR</Text>
      <View style={styles.conseilCard}>
        <Ionicons name="heart" size={18} color="#f74f6e" style={{ marginRight: 10 }} />
        <Text style={styles.conseilText}>{conseil}</Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff', padding: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 50, marginBottom: 20
  },
  headerSub: { color: '#8a99b3', fontSize: 13 },
  headerName: { color: '#1a2340', fontSize: 22, fontWeight: '700' },
  notifBtn: {
    width: 42, height: 42, backgroundColor: '#4f8ef7',
    borderRadius: 21, alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: '#e74c3c', borderRadius: 10,
    width: 18, height: 18, alignItems: 'center',
    justifyContent: 'center', borderWidth: 2, borderColor: '#f0f4ff'
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  heroCard: {
    backgroundColor: '#4f8ef7', borderRadius: 16,
    padding: 22, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16
  },
  heroLabel: { color: '#c8dcff', fontSize: 10, letterSpacing: 2, marginBottom: 6 },
  heroName: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  heroNss: { color: '#c8dcff', fontSize: 12, marginBottom: 10 },
  heroRow: { flexDirection: 'row' },
  heroBadge: {
    backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 3
  },
  heroBadgeText: { color: '#4f8ef7', fontSize: 10, fontWeight: '700' },
  heroCircle: {
    width: 64, height: 64, backgroundColor: '#3a7ae4',
    borderRadius: 32, alignItems: 'center', justifyContent: 'center'
  },
  heroInitials: { color: '#fff', fontSize: 22, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12,
    padding: 14, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, elevation: 2
  },
  statValue: { color: '#1a2340', fontSize: 20, fontWeight: '700', marginTop: 6 },
  statLabel: { color: '#8a99b3', fontSize: 10, marginTop: 2, textAlign: 'center' },
  rdvBtn: {
    backgroundColor: '#1a2340', borderRadius: 12,
    padding: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24
  },
  rdvBtnText: { color: '#fff', fontSize: 13, fontWeight: '600', letterSpacing: 1 },
  sectionTitle: {
    color: '#8a99b3', fontSize: 11, letterSpacing: 2,
    marginBottom: 10, fontWeight: '600'
  },
  rdvCard: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 16, flexDirection: 'row',
    alignItems: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, elevation: 2
  },
  rdvDateBox: {
    backgroundColor: '#eef3ff', borderRadius: 10,
    padding: 12, alignItems: 'center', marginRight: 14
  },
  rdvDate: { color: '#4f8ef7', fontSize: 22, fontWeight: '700' },
  rdvMonth: { color: '#8a99b3', fontSize: 11, letterSpacing: 1 },
  rdvInfo: { flex: 1 },
  rdvDoctor: { color: '#1a2340', fontSize: 15, fontWeight: '600', marginBottom: 3 },
  rdvSpec: { color: '#8a99b3', fontSize: 12, marginBottom: 5 },
  rdvTimeRow: { flexDirection: 'row', alignItems: 'center' },
  rdvTime: { color: '#4f8ef7', fontSize: 12 },
  rdvStatusBadge: {
    backgroundColor: '#eafaf1', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4
  },
  rdvStatusText: { color: '#27ae60', fontSize: 11, fontWeight: '600' },
  emptyRdv: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 20, alignItems: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, elevation: 2
  },
  emptyRdvText: { color: '#8a99b3', fontSize: 14, marginBottom: 8 },
  emptyRdvLink: { color: '#4f8ef7', fontSize: 14, fontWeight: '600' },
  conseilCard: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 16, flexDirection: 'row',
    alignItems: 'center', marginBottom: 40,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, elevation: 2
  },
  conseilText: { color: '#4a5568', fontSize: 13, flex: 1, lineHeight: 20 },
});

export default Dashboard;