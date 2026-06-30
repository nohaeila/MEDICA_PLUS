import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const Notifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (err) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

const handleMarkAsRead = async (id) => {
  try {
    await api.put(`/notifications/${id}/read`);
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, lu: true } : n
    ));
  } catch (err) {
    console.error(err);
  }
};

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, lu: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const unreadCount = notifications.filter(n => !n.lu).length;

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1a2340" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 60 }} />
        </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Ionicons name="notifications" size={16} color="#4f8ef7" style={{ marginRight: 8 }} />
          <Text style={styles.unreadText}>{unreadCount} notification(s) non lue(s)</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f8ef7" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={48} color="#c8d5e8" />
          <Text style={styles.emptyText}>Aucune notification</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {notifications.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              style={[styles.notifCard, !notif.lu && styles.notifCardUnread]}
              onPress={() => handleMarkAsRead(notif.id)}>
              <View style={[styles.notifIconBox, !notif.lu && styles.notifIconBoxUnread]}>
                <Ionicons
                  name={notif.lu ? 'notifications-outline' : 'notifications'}
                  size={20}
                  color={notif.lu ? '#8a99b3' : '#4f8ef7'}
                />
              </View>
              <View style={styles.notifContent}>
                <Text style={[styles.notifMessage, !notif.lu && styles.notifMessageUnread]}>
                  {notif.message}
                </Text>
                <Text style={styles.notifDate}>{formatDate(notif.createdAt)}</Text>
              </View>
              {!notif.lu && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))}
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
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1a2340' },
  readAllBtn: { color: '#4f8ef7', fontSize: 13, fontWeight: '600' },

  unreadBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#eef3ff', marginHorizontal: 20,
    borderRadius: 10, padding: 12, marginBottom: 16,
    borderWidth: 1, borderColor: '#d0e4ff'
  },
  unreadText: { color: '#4f8ef7', fontSize: 13 },

  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#8a99b3', marginTop: 12, fontSize: 14 },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#8a99b3', fontSize: 16, marginTop: 12 },

  list: { paddingHorizontal: 20 },

  notifCard: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 16, flexDirection: 'row',
    alignItems: 'center', marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, elevation: 2
  },
  notifCardUnread: {
    backgroundColor: '#f0f6ff',
    borderWidth: 1, borderColor: '#d0e4ff'
  },
  notifIconBox: {
    width: 42, height: 42, backgroundColor: '#f5f5f5',
    borderRadius: 21, alignItems: 'center',
    justifyContent: 'center', marginRight: 14
  },
  notifIconBoxUnread: { backgroundColor: '#eef3ff' },
  notifContent: { flex: 1 },
  notifMessage: { color: '#4a5568', fontSize: 13, lineHeight: 20, marginBottom: 4 },
  notifMessageUnread: { color: '#1a2340', fontWeight: '600' },
  notifDate: { color: '#8a99b3', fontSize: 11 },
  unreadDot: {
    width: 8, height: 8, backgroundColor: '#4f8ef7',
    borderRadius: 4, marginLeft: 8
  },
});

export default Notifications;