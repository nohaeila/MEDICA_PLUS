import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

const medecins = [
  { id: 1, nom: 'Dr. Martin', spec: 'Medecin generaliste', dispo: '9h - 18h' },
  { id: 2, nom: 'Dr. Leblanc', spec: 'Cardiologue', dispo: '10h - 17h' },
  { id: 3, nom: 'Dr. Durand', spec: 'Dermatologue', dispo: '8h - 16h' },
];

const horaires = ['09h00', '09h30', '10h00', '10h30', '11h00', '11h30',
  '14h00', '14h30', '15h00', '15h30', '16h00', '16h30'];

const PriseRDV = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [selectedMedecin, setSelectedMedecin] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHeure, setSelectedHeure] = useState('');
  const [motif, setMotif] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleConfirm = () => {
    // on branchera l'API plus tard
    navigation.navigate('RendezVous');
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

        {/* STEP 1 — CHOIX MEDECIN */}
        {step === 1 && (
          <View>
            <Text style={styles.sectionTitle}>Choisissez un medecin</Text>
            {medecins.map((med) => (
              <TouchableOpacity
                key={med.id}
                style={[styles.medecinCard, selectedMedecin?.id === med.id && styles.medecinCardActive]}
                onPress={() => setSelectedMedecin(med)}>
                <View style={styles.medecinAvatar}>
                  <Ionicons name="person" size={22} color="#4f8ef7" />
                </View>
                <View style={styles.medecinInfo}>
                  <Text style={styles.medecinNom}>{med.nom}</Text>
                  <Text style={styles.medecinSpec}>{med.spec}</Text>
                  <View style={styles.medecinDispoRow}>
                    <Ionicons name="time-outline" size={12} color="#8a99b3" style={{ marginRight: 4 }} />
                    <Text style={styles.medecinDispo}>{med.dispo}</Text>
                  </View>
                </View>
                {selectedMedecin?.id === med.id && (
                  <Ionicons name="checkmark-circle" size={22} color="#4f8ef7" />
                )}
              </TouchableOpacity>
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

        {/* STEP 2 — CHOIX DATE ET HEURE */}
        {step === 2 && (
          <View>
            <Text style={styles.sectionTitle}>Choisissez une date</Text>
            <View style={styles.calendarWrapper}>
              <Calendar
                minDate={today}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    selectedColor: '#4f8ef7'
                  }
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
                <Text style={styles.sectionTitle}>Choisissez une heure</Text>
                <View style={styles.horaireGrid}>
                  {horaires.map((h) => (
                    <TouchableOpacity
                      key={h}
                      style={[styles.horaireBtn, selectedHeure === h && styles.horaireBtnActive]}
                      onPress={() => setSelectedHeure(h)}>
                      <Text style={[styles.horaireText, selectedHeure === h && styles.horaireTextActive]}>
                        {h}
                      </Text>
                    </TouchableOpacity>
                  ))}
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
            <Text style={styles.sectionTitle}>Confirmation</Text>

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

            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.confirmBtnText}>CONFIRMER LE RDV</Text>
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
    justifyContent: 'center', paddingHorizontal: 20,
    marginBottom: 24
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

  medecinCard: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 16, flexDirection: 'row',
    alignItems: 'center', marginBottom: 12,
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
  medecinSpec: { color: '#8a99b3', fontSize: 12, marginBottom: 5 },
  medecinDispoRow: { flexDirection: 'row', alignItems: 'center' },
  medecinDispo: { color: '#8a99b3', fontSize: 11 },

  calendarWrapper: {
    backgroundColor: '#fff', borderRadius: 14,
    overflow: 'hidden', marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, elevation: 2
  },

  horaireGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 10, marginBottom: 20
  },
  horaireBtn: {
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: '#fff', borderRadius: 10,
    borderWidth: 1, borderColor: '#e2e8f0'
  },
  horaireBtnActive: { backgroundColor: '#4f8ef7', borderColor: '#4f8ef7' },
  horaireText: { color: '#1a2340', fontSize: 13, fontWeight: '500' },
  horaireTextActive: { color: '#fff' },

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

  confirmBtn: {
    backgroundColor: '#27ae60', borderRadius: 12,
    padding: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 30
  },
  confirmBtnText: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
});

export default PriseRDV;