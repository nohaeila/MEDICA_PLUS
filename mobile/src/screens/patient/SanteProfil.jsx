import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const SanteProfil = ({ navigation }) => {
  const [antecedents, setAntecedents] = useState('');
  const [antecedentsChirurgicaux, setAntecedentsChirurgicaux] = useState('');
  const [allergies, setAllergies] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDossier();
  }, []);

  const fetchDossier = async () => {
    try {
      const response = await api.get('/dossier');
      setAntecedents(response.data.dossier.antecedents || '');
      setAntecedentsChirurgicaux(response.data.dossier.antecedentsChirurgicaux || '');
      setAllergies(response.data.dossier.allergies || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/dossier', {
        antecedents,
        antecedentsChirurgicaux,
        allergies
      });
      Alert.alert('Succès', 'Votre dossier a été mis à jour', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le dossier');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a2340" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ma Santé</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f8ef7" />
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={18} color="#4f8ef7" style={{ marginRight: 10 }} />
            <Text style={styles.infoText}>
              Ces informations seront visibles par votre médecin. Séparez chaque élément par une ligne.
            </Text>
          </View>

          <Text style={styles.sectionLabel}>ANTÉCÉDENTS MÉDICAUX</Text>
          <View style={styles.card}>
            <TextInput
              style={styles.textArea}
              value={antecedents}
              onChangeText={setAntecedents}
              placeholder={"Hypertension artérielle\nDiabète type 2\n..."}
              placeholderTextColor="#b0bec5"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <Text style={styles.sectionLabel}>ANTÉCÉDENTS CHIRURGICAUX</Text>
          <View style={styles.card}>
            <TextInput
              style={styles.textArea}
              value={antecedentsChirurgicaux}
              onChangeText={setAntecedentsChirurgicaux}
              placeholder={"Appendicectomie 2010\nArthroscopie genou 2018\n..."}
              placeholderTextColor="#b0bec5"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <Text style={styles.sectionLabel}>ALLERGIES</Text>
          <View style={styles.card}>
            <TextInput
              style={styles.textArea}
              value={allergies}
              onChangeText={setAllergies}
              placeholder={"Pénicilline\nAsprine\n..."}
              placeholderTextColor="#b0bec5"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}>
            {saving
              ? <ActivityIndicator color="#fff" />
              : <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveBtnText}>ENREGISTRER</Text>
              </>
            }
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
  content: { paddingHorizontal: 20 },

  infoCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#eef3ff', borderRadius: 12,
    padding: 14, marginBottom: 24,
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
  textArea: {
    color: '#1a2340', fontSize: 14,
    lineHeight: 22, minHeight: 100
  },

  saveBtn: {
    backgroundColor: '#4f8ef7', borderRadius: 14,
    padding: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 40
  },
  saveBtnDisabled: { backgroundColor: '#a8c7fa' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 1 },
});

export default SanteProfil;