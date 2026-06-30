import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import PriseRDV from '../screens/patient/PriseRDV';
import Notifications from '../screens/patient/Notifications';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import Dashboard from '../screens/patient/Dashboard';
import Ordonnances from '../screens/patient/Ordonnances';
import RendezVous from '../screens/patient/RendezVous';
import Dossier from '../screens/patient/Dossier';
import Profil from '../screens/patient/Profil';
import ProfilMedecin from '../screens/patient/ProfilMedecin';
import SanteProfil from '../screens/patient/SanteProfil';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PatientTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'home-outline';
          else if (route.name === 'RendezVous') iconName = 'calendar-outline';
          else if (route.name === 'Ordonnances') iconName = 'document-text-outline';
          else if (route.name === 'Dossier') iconName = 'folder-outline';
          else if (route.name === 'Profil') iconName = 'person-outline';
          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#0d1321',
          borderTopColor: '#1e3a5f',
          borderTopWidth: 0.5,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarActiveTintColor: '#3b9eff',
        tabBarInactiveTintColor: '#4a6fa5',
        tabBarLabelStyle: { fontSize: 11 }
      })}>
      <Tab.Screen name="Dashboard" component={Dashboard} options={{ tabBarLabel: 'Accueil' }} />
      <Tab.Screen name="RendezVous" component={RendezVous} options={{ tabBarLabel: 'Mes RDV' }} />
      <Tab.Screen name="Ordonnances" component={Ordonnances} options={{ tabBarLabel: 'Ordonnances' }} />
      <Tab.Screen name="Dossier" component={Dossier} options={{ tabBarLabel: 'Dossier' }} />
      <Tab.Screen name="Profil" component={Profil} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="PatientTabs" component={PatientTabs} />
        <Stack.Screen name="PriseRDV" component={PriseRDV} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="ProfilMedecin" component={ProfilMedecin} />
        <Stack.Screen name="SanteProfil" component={SanteProfil} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;


