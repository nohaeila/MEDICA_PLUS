import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const ProfilMedecin = ({ route, navigation }) => {
  const { medecinId } = route.params;
  const [medecin, setMedecin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedecin();
  }, []);

  const fetchMedecin = async () => {
    try {
      const response = await api.get(`/medecins/${medecinId}`);
      setMedecin(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a2340" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fiche médecin</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f8ef7" />
        </View>
      ) : !medecin ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Médecin introuvable</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

          {/* AVATAR + NOM */}
          <View style={styles.heroCard}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#4f8ef7" />
            </View>
            <Text style={styles.medecinNom}>Dr. {medecin.prenom} {medecin.nom}</Text>
            <View style={styles.specBadge}>
              <Text style={styles.specText}>{medecin.specialite}</Text>
            </View>
          </View>

          {/* INFOS */}
          <Text style={styles.sectionLabel}>COORDONNÉES</Text>
          <View style={styles.card}>

            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons name="call-outline" size={18} color="#4f8ef7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>TÉLÉPHONE</Text>
                <Text style={styles.infoValue}>{medecin.telephone || 'Non renseigné'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons name="mail-outline" size={18} color="#4f8ef7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>EMAIL</Text>
                <Text style={styles.infoValue}>{medecin.email || 'Non renseigné'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons name="medical-outline" size={18} color="#4f8ef7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>SPÉCIALITÉ</Text>
                <Text style={styles.infoValue}>{medecin.specialite}</Text>
              </View>
            </View>

          </View>

          {/* BOUTON PRENDRE RDV */}
          <TouchableOpacity
            style={styles.rdvBtn}
            onPress={() => navigation.navigate('PriseRDV', { preselectedMedecin: medecin })}>
            <Ionicons name="calendar-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.rdvBtnText}>PRENDRE UN RDV</Text>
          </TouchableOpacity>

        </ScrollView>
      )}
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1a2340' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#8a99b3', fontSize: 15 },
  content: { paddingHorizontal: 20 },

  heroCard: {
    backgroundColor: '#fff', borderRadius: 20,
    padding: 28, alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.06,
    shadowRadius: 12, elevation: 3
  },
  avatar: {
    width: 80, height: 80, backgroundColor: '#eef3ff',
    borderRadius: 40, alignItems: 'center',
    justifyContent: 'center', marginBottom: 16
  },
  medecinNom: { fontSize: 20, fontWeight: '700', color: '#1a2340', marginBottom: 10 },
  specBadge: {
    backgroundColor: '#eef3ff', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 6
  },
  specText: { color: '#4f8ef7', fontSize: 13, fontWeight: '600' },

  sectionLabel: {
    fontSize: 11, color: '#8a99b3',
    letterSpacing: 2, marginBottom: 10, fontWeight: '600'
  },
  card: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 16, marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, elevation: 2
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  iconBox: {
    width: 36, height: 36, backgroundColor: '#eef3ff',
    borderRadius: 18, alignItems: 'center',
    justifyContent: 'center', marginRight: 14
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 10, color: '#8a99b3', letterSpacing: 2, marginBottom: 4 },
  infoValue: { fontSize: 15, color: '#1a2340', fontWeight: '600' },
  divider: { height: 0.5, backgroundColor: '#e2e8f0', marginVertical: 4 },

  rdvBtn: {
    backgroundColor: '#4f8ef7', borderRadius: 14,
    padding: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 40
  },
  rdvBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 1 },
});

export default ProfilMedecin;