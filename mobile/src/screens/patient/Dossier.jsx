import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const Dossier = ({ navigation }) => {
  const [dossier, setDossier] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDossier();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchDossier = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dossier');
      setDossier(response.data.dossier);
      setPatient(response.data.patient);
    } catch (err) {
      setPatient({
        prenom: 'Jean',
        nom: 'Dupont',
        dateNaissance: '1985-05-15',
        medecinTraitant: 'Dr. Martin Bernard'
      });
      setDossier({
        antecedents: 'Hypertension arterielle\nDiabete type 2',
        antecedentsChirurgicaux: 'Appendicectomie 2010\nArthroscopie genou gauche 2018',
        allergies: 'Penicilline\nAsprine',
        notes: 'Patient suivi regulierement'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Non renseigné';
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${day} ${new Date(year, month - 1).toLocaleString('fr-FR', { month: 'long' })} ${year}`;
    }
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Dossier Medical</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f8ef7" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

          {/* BOUTON RENSEIGNER */}
          <TouchableOpacity
            style={styles.editSanteBtn}
            onPress={() => navigation.navigate('SanteProfil')}>
            <Ionicons name="create-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.editSanteBtnText}>Renseigner mes informations de santé</Text>
          </TouchableOpacity>

          {/* INFO SECURITE */}
          <View style={styles.infoCard}>
            <Ionicons name="shield-checkmark" size={18} color="#4f8ef7" style={{ marginRight: 10 }} />
            <Text style={styles.infoText}>
              Les notes sont réservées à votre médecin. Antécédents et allergies sont renseignés par vous.
            </Text>
          </View>

          {/* INFOS PATIENT */}
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
                <Ionicons name="medical-outline" size={18} color="#4f8ef7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>MEDECIN TRAITANT</Text>
                <Text style={styles.infoValue}>{patient?.medecinTraitant || 'Non renseigne'}</Text>
              </View>
            </View>
          </View>

          {/* ANTECEDENTS MEDICAUX */}
          <Text style={styles.sectionLabel}>ANTECEDENTS MEDICAUX</Text>
          <View style={styles.card}>
            {dossier?.antecedents ? (
              dossier.antecedents.split('\n').filter(l => l.trim()).map((line, i) => (
                <View key={i} style={styles.itemRow}>
                  <View style={[styles.itemDot, { backgroundColor: '#4f8ef7' }]} />
                  <Text style={styles.itemText}>{line}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Aucun antecedent renseigne</Text>
            )}
          </View>

          {/* ANTECEDENTS CHIRURGICAUX */}
          <Text style={styles.sectionLabel}>ANTECEDENTS CHIRURGICAUX</Text>
          <View style={styles.card}>
            {dossier?.antecedentsChirurgicaux ? (
              dossier.antecedentsChirurgicaux.split('\n').filter(l => l.trim()).map((line, i) => (
                <View key={i} style={styles.itemRow}>
                  <View style={[styles.itemDot, { backgroundColor: '#f7934f' }]} />
                  <Text style={styles.itemText}>{line}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Aucun antecedent chirurgical renseigne</Text>
            )}
          </View>

          {/* ALLERGIES */}
          <Text style={styles.sectionLabel}>ALLERGIES</Text>
          <View style={styles.card}>
            {dossier?.allergies ? (
              dossier.allergies.split('\n').filter(l => l.trim()).map((line, i) => (
                <View key={i} style={styles.allergyRow}>
                  <View style={styles.allergyIconBox}>
                    <Ionicons name="warning-outline" size={14} color="#e74c3c" />
                  </View>
                  <Text style={styles.allergyText}>{line}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Aucune allergie renseignee</Text>
            )}
          </View>

          {/* NOTES MEDECIN */}
          <Text style={styles.sectionLabel}>NOTES DU MEDECIN</Text>
          <View style={[styles.card, { marginBottom: 40 }]}>
            {dossier?.notes ? (
              <Text style={styles.notesText}>{dossier.notes}</Text>
            ) : (
              <Text style={styles.emptyText}>Aucune note renseignee</Text>
            )}
          </View>

        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { paddingHorizontal: 20, paddingTop: 55, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1a2340' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  loadingText: { color: '#8a99b3', marginTop: 12, fontSize: 14 },
  content: { paddingHorizontal: 20 },

  editSanteBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#4f8ef7', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    marginBottom: 16
  },
  editSanteBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  infoCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#eef3ff', borderRadius: 12,
    padding: 14, marginBottom: 20,
    borderWidth: 1, borderColor: '#d0e4ff'
  },
  infoText: { color: '#4a6fa5', fontSize: 12, flex: 1, lineHeight: 18 },

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
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  infoIconBox: {
    width: 36, height: 36, backgroundColor: '#eef3ff',
    borderRadius: 18, alignItems: 'center',
    justifyContent: 'center', marginRight: 14
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 10, color: '#8a99b3', letterSpacing: 2, marginBottom: 4 },
  infoValue: { fontSize: 15, color: '#1a2340', fontWeight: '600' },
  divider: { height: 0.5, backgroundColor: '#e2e8f0', marginVertical: 4 },

  itemRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  itemDot: { width: 6, height: 6, borderRadius: 3, marginRight: 10, marginTop: 6 },
  itemText: { color: '#4a5568', fontSize: 14, flex: 1, lineHeight: 20 },

  allergyRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fdf0f0', borderRadius: 8,
    padding: 10, marginBottom: 8,
    borderWidth: 1, borderColor: '#fcc'
  },
  allergyIconBox: { marginRight: 10 },
  allergyText: { color: '#e74c3c', fontSize: 14, fontWeight: '500' },

  notesText: { color: '#4a5568', fontSize: 14, lineHeight: 22 },
  emptyText: { color: '#b0bec5', fontSize: 13, fontStyle: 'italic' },
});

export default Dossier;