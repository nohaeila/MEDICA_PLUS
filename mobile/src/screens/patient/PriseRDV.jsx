import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import api from '../../services/api';

const horaires = ['09h00', '09h30', '10h00', '10h30', '11h00', '11h30',
  '14h00', '14h30', '15h00', '15h30', '16h00', '16h30'];

const PriseRDV = ({ route, navigation }) => {
  const preselected = route.params?.preselectedMedecin || null;

  const [step, setStep] = useState(preselected ? 2 : 1);
  const [search, setSearch] = useState('');
  const [medecins, setMedecins] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedMedecin, setSelectedMedecin] = useState(preselected);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHeure, setSelectedHeure] = useState('');
  const [horairesPris, setHorairesPris] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const searchMedecins = async (text) => {
    setSearch(text);
    if (text.length < 2) { setMedecins([]); return; }
    setSearching(true);
    try {
      const response = await api.get(`/medecins/search?query=${text}`);
      setMedecins(response.data);
    } catch (err) {
      setMedecins([]);
    } finally {
      setSearching(false);
    }
  };

  const fetchHorairesPris = async (date) => {
    if (!selectedMedecin) return;
    try {
      const response = await api.get(`/rdv/horaires-pris?medecinId=${selectedMedecin.id}&date=${date}`);
      setHorairesPris(response.data);
    } catch (err) {
      setHorairesPris([]);
    }
  };

const handleConfirm = async () => {
  setLoading(true);
  setError('');
  try {
    await api.post('/rdv', {
      medecinId: selectedMedecin.id,
      date: selectedDate,
      heure: selectedHeure,
      motif: 'Consultation'
    });
    navigation.navigate('PatientTabs', { screen: 'RendezVous' });
  } catch (err) {
    setError(err.response?.data?.error || 'Erreur lors de la creation du RDV');
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step === 1 ? navigation.goBack() : setStep(step - 1)}>
          <Ionicons name="arrow-back" size={24} color="#1a2340" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prendre un RDV</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* STEPS */}
      <View style={styles.stepsRow}>
        {[1, 2, 3].map((s) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepCircle, step >= s && styles.stepCircleActive]}>
              <Text style={[styles.stepNum, step >= s && styles.stepNumActive]}>{s}</Text>
            </View>
            <Text style={[styles.stepLabel, step >= s && styles.stepLabelActive]}>
              {s === 1 ? 'Medecin' : s === 2 ? 'Date' : 'Confirm.'}
            </Text>
            {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
          </View>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* STEP 1 — RECHERCHE MEDECIN */}
        {step === 1 && (
          <View>
            <Text style={styles.sectionTitle}>RECHERCHEZ UN MEDECIN</Text>

            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color="#8a99b3" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Nom, specialite..."
                placeholderTextColor="#b0bec5"
                value={search}
                onChangeText={searchMedecins}
              />
              {searching && <ActivityIndicator size="small" color="#4f8ef7" />}
            </View>

            {search.length < 2 && (
              <Text style={styles.searchHint}>Tapez au moins 2 caracteres pour rechercher</Text>
            )}

            {medecins.length === 0 && search.length >= 2 && !searching && (
              <Text style={styles.searchHint}>Aucun medecin trouve</Text>
            )}

            {medecins.map((med) => (
              <View key={med.id} style={styles.medecinCardWrapper}>
                <TouchableOpacity
                  style={[styles.medecinCard, selectedMedecin?.id === med.id && styles.medecinCardActive]}
                  onPress={() => setSelectedMedecin(med)}>
                  <View style={styles.medecinAvatar}>
                    <Ionicons name="person" size={22} color="#4f8ef7" />
                  </View>
                  <View style={styles.medecinInfo}>
                    <Text style={styles.medecinNom}>{med.nom}</Text>
                    <Text style={styles.medecinSpec}>{med.spec} {med.ville ? `— ${med.ville}` : ''}</Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('ProfilMedecin', { medecinId: med.id })}>
                      <Text style={styles.voirProfilLink}>Voir le profil →</Text>
                    </TouchableOpacity>
                  </View>
                  {selectedMedecin?.id === med.id && (
                    <Ionicons name="checkmark-circle" size={22} color="#4f8ef7" />
                  )}
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.nextBtn, !selectedMedecin && styles.nextBtnDisabled]}
              onPress={() => selectedMedecin && setStep(2)}
              disabled={!selectedMedecin}>
              <Text style={styles.nextBtnText}>SUIVANT</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2 — DATE ET HEURE */}
        {step === 2 && (
          <View>
            <Text style={styles.sectionTitle}>CHOISISSEZ UNE DATE</Text>
            <View style={styles.calendarWrapper}>
              <Calendar
                minDate={today}
                onDayPress={(day) => {
                  setSelectedDate(day.dateString);
                  setSelectedHeure('');
                  fetchHorairesPris(day.dateString);
                }}
                markedDates={{
                  [selectedDate]: { selected: true, selectedColor: '#4f8ef7' }
                }}
                theme={{
                  backgroundColor: '#fff',
                  calendarBackground: '#fff',
                  textSectionTitleColor: '#8a99b3',
                  selectedDayBackgroundColor: '#4f8ef7',
                  selectedDayTextColor: '#fff',
                  todayTextColor: '#4f8ef7',
                  dayTextColor: '#1a2340',
                  textDisabledColor: '#d0d8e8',
                  arrowColor: '#4f8ef7',
                  monthTextColor: '#1a2340',
                  textDayFontWeight: '500',
                  textMonthFontWeight: '700',
                }}
              />
            </View>

            {selectedDate ? (
              <>
                <Text style={styles.sectionTitle}>CHOISISSEZ UNE HEURE</Text>
                <View style={styles.horaireGrid}>
                  {horaires.map((h) => {
                    const isPris = horairesPris.includes(h);
                    return (
                      <TouchableOpacity
                        key={h}
                        style={[
                          styles.horaireBtn,
                          selectedHeure === h && styles.horaireBtnActive,
                          isPris && styles.horaireBtnPris
                        ]}
                        onPress={() => !isPris && setSelectedHeure(h)}
                        disabled={isPris}>
                        <Text style={[
                          styles.horaireText,
                          selectedHeure === h && styles.horaireTextActive,
                          isPris && styles.horaireTextPris
                        ]}>
                          {h}
                        </Text>
                        {isPris && <Text style={styles.prisBadge}>Pris</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : null}

            <TouchableOpacity
              style={[styles.nextBtn, (!selectedDate || !selectedHeure) && styles.nextBtnDisabled]}
              onPress={() => selectedDate && selectedHeure && setStep(3)}
              disabled={!selectedDate || !selectedHeure}>
              <Text style={styles.nextBtnText}>SUIVANT</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3 — CONFIRMATION */}
        {step === 3 && (
          <View>
            <Text style={styles.sectionTitle}>CONFIRMATION</Text>

            <View style={styles.confirmCard}>
              <View style={styles.confirmRow}>
                <Ionicons name="person-outline" size={18} color="#4f8ef7" style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.confirmLabel}>MEDECIN</Text>
                  <Text style={styles.confirmValue}>{selectedMedecin?.nom}</Text>
                  <Text style={styles.confirmSub}>{selectedMedecin?.spec}</Text>
                </View>
              </View>
              <View style={styles.confirmDivider} />
              <View style={styles.confirmRow}>
                <Ionicons name="calendar-outline" size={18} color="#4f8ef7" style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.confirmLabel}>DATE</Text>
                  <Text style={styles.confirmValue}>{selectedDate}</Text>
                </View>
              </View>
              <View style={styles.confirmDivider} />
              <View style={styles.confirmRow}>
                <Ionicons name="time-outline" size={18} color="#4f8ef7" style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.confirmLabel}>HEURE</Text>
                  <Text style={styles.confirmValue}>{selectedHeure}</Text>
                </View>
              </View>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color="#e74c3c" style={{ marginRight: 6 }} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.confirmBtn, loading && styles.confirmBtnDisabled]}
              onPress={handleConfirm}
              disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.confirmBtnText}>CONFIRMER LE RDV</Text>
                </>
              }
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
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
  stepsRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingHorizontal: 20, marginBottom: 24
  },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#e8edf7', alignItems: 'center', justifyContent: 'center'
  },
  stepCircleActive: { backgroundColor: '#4f8ef7' },
  stepNum: { color: '#8a99b3', fontSize: 13, fontWeight: '700' },
  stepNumActive: { color: '#fff' },
  stepLabel: { color: '#8a99b3', fontSize: 11, marginLeft: 6 },
  stepLabelActive: { color: '#1a2340', fontWeight: '600' },
  stepLine: { width: 30, height: 2, backgroundColor: '#e8edf7', marginHorizontal: 6 },
  stepLineActive: { backgroundColor: '#4f8ef7' },
  content: { paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 11, color: '#8a99b3',
    letterSpacing: 2, marginBottom: 12, fontWeight: '600'
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1, borderColor: '#e2e8f0',
    paddingHorizontal: 14, marginBottom: 12,
  },
  searchInput: { flex: 1, padding: 12, color: '#1a2340', fontSize: 14 },
  searchHint: { color: '#8a99b3', fontSize: 13, textAlign: 'center', marginTop: 20, marginBottom: 20 },
  medecinCardWrapper: { marginBottom: 12 },
  medecinCard: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 16, flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5, borderColor: 'transparent',
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, elevation: 2
  },
  medecinCardActive: { borderColor: '#4f8ef7', backgroundColor: '#f0f6ff' },
  medecinAvatar: {
    width: 46, height: 46, backgroundColor: '#eef3ff',
    borderRadius: 23, alignItems: 'center',
    justifyContent: 'center', marginRight: 14
  },
  medecinInfo: { flex: 1 },
  medecinNom: { color: '#1a2340', fontSize: 15, fontWeight: '600', marginBottom: 3 },
  medecinSpec: { color: '#8a99b3', fontSize: 12 },
  voirProfilLink: { color: '#4f8ef7', fontSize: 12, marginTop: 4, fontWeight: '600' },
  calendarWrapper: {
    backgroundColor: '#fff', borderRadius: 14,
    overflow: 'hidden', marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, elevation: 2
  },
  horaireGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  horaireBtn: {
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: '#fff', borderRadius: 10,
    borderWidth: 1, borderColor: '#e2e8f0',
    alignItems: 'center'
  },
  horaireBtnActive: { backgroundColor: '#4f8ef7', borderColor: '#4f8ef7' },
  horaireBtnPris: { backgroundColor: '#f5f5f5', borderColor: '#e0e0e0', opacity: 0.6 },
  horaireText: { color: '#1a2340', fontSize: 13, fontWeight: '500' },
  horaireTextActive: { color: '#fff' },
  horaireTextPris: { color: '#b0bec5' },
  prisBadge: { color: '#b0bec5', fontSize: 9, marginTop: 2 },
  nextBtn: {
    backgroundColor: '#4f8ef7', borderRadius: 12,
    padding: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 8, marginBottom: 30
  },
  nextBtnDisabled: { backgroundColor: '#a8c7fa' },
  nextBtnText: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  confirmCard: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 20, marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, elevation: 2
  },
  confirmRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  confirmDivider: { height: 0.5, backgroundColor: '#e2e8f0', marginVertical: 4 },
  confirmLabel: { color: '#8a99b3', fontSize: 10, letterSpacing: 2, marginBottom: 4 },
  confirmValue: { color: '#1a2340', fontSize: 15, fontWeight: '600' },
  confirmSub: { color: '#8a99b3', fontSize: 12, marginTop: 2 },
  errorBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fdf0f0', borderRadius: 10,
    borderWidth: 1, borderColor: '#fcc',
    padding: 10, marginBottom: 16
  },
  errorText: { color: '#e74c3c', fontSize: 13, flex: 1 },
  confirmBtn: {
    backgroundColor: '#27ae60', borderRadius: 12,
    padding: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', marginBottom: 30
  },
  confirmBtnDisabled: { backgroundColor: '#a8d5b5' },
  confirmBtnText: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
});

export default PriseRDV;