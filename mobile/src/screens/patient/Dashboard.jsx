import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const Dashboard = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Bonjour,</Text>
          <Text style={styles.headerName}>Jean Dupont</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* CARTE HERO */}
      <View style={styles.heroCard}>
        <View>
          <Text style={styles.heroLabel}>DOSSIER PATIENT</Text>
          <Text style={styles.heroName}>Jean Dupont</Text>
          <Text style={styles.heroNss}>NSS : 1 85 05 75 108 001 48</Text>
          <View style={styles.heroRow}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>ACTIF</Text>
            </View>
          </View>
        </View>
        <View style={styles.heroCircle}>
          <Ionicons name="person" size={32} color="#fff" />
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={20} color="#4f8ef7" />
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>RDV a venir</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="pill" size={20} color="#f7934f" />
          <Text style={styles.statValue}>2</Text>
          <Text style={styles.statLabel}>Traitements</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="document-text" size={20} color="#4fc9f7" />
          <Text style={styles.statValue}>5</Text>
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
      <View style={styles.rdvCard}>
        <View style={styles.rdvDateBox}>
          <Text style={styles.rdvDate}>15</Text>
          <Text style={styles.rdvMonth}>JUL</Text>
        </View>
        <View style={styles.rdvInfo}>
          <Text style={styles.rdvDoctor}>Dr. Martin</Text>
          <Text style={styles.rdvSpec}>Medecin generaliste</Text>
          <View style={styles.rdvTimeRow}>
            <Ionicons name="time-outline" size={13} color="#4f8ef7" style={{ marginRight: 4 }} />
            <Text style={styles.rdvTime}>10h30 — Paris 8e</Text>
          </View>
        </View>
        <View style={styles.rdvStatusBadge}>
          <Text style={styles.rdvStatusText}>Confirme</Text>
        </View>
      </View>

      {/* RAPPEL TRAITEMENT */}
      <Text style={styles.sectionTitle}>RAPPEL TRAITEMENT</Text>
      <View style={styles.rappelCard}>
        <View style={styles.rappelIconBox}>
          <MaterialCommunityIcons name="pill" size={22} color="#f7934f" />
        </View>
        <View style={styles.rappelInfo}>
          <Text style={styles.rappelName}>Doliprane 1000mg</Text>
          <Text style={styles.rappelSub}>A prendre apres le repas du soir</Text>
        </View>
        <View style={styles.rappelTime}>
          <Text style={styles.rappelTimeText}>20h00</Text>
        </View>
      </View>

      {/* CONSEIL */}
      <Text style={styles.sectionTitle}>CONSEIL DU JOUR</Text>
      <View style={styles.conseilCard}>
        <Ionicons name="heart" size={18} color="#f74f6e" style={{ marginRight: 10 }} />
        <Text style={styles.conseilText}>
          Pensez a boire au moins 1,5L d'eau par jour pour rester hydrate.
        </Text>
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

  rappelCard: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 16, flexDirection: 'row',
    alignItems: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, elevation: 2
  },
  rappelIconBox: {
    width: 44, height: 44, backgroundColor: '#fff5ee',
    borderRadius: 22, alignItems: 'center',
    justifyContent: 'center', marginRight: 12
  },
  rappelInfo: { flex: 1 },
  rappelName: { color: '#1a2340', fontSize: 14, fontWeight: '600', marginBottom: 3 },
  rappelSub: { color: '#8a99b3', fontSize: 12 },
  rappelTime: {
    backgroundColor: '#fff5ee', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4
  },
  rappelTimeText: { color: '#f7934f', fontSize: 12, fontWeight: '600' },

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