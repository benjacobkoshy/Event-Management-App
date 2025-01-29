import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Card, Icon, Layout, Text } from '@ui-kitten/components';
import ViewAllEventsScreen from './ViewAllEventsScreen';

export default function DashboardScreen({ navigation }) {
  const upcomingEvents = [
    { id: '1', name: 'Tech Conference 2025', date: 'Jan 30, 2025' },
    { id: '2', name: 'Music Fest', date: 'Feb 5, 2025' },
  ];

  return (
    <Layout style={styles.container}>
      <Text category='h2'>Welcome, Organizer!</Text>

      <ViewAllEventsScreen />

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Add Event')}>
          <Icon name="plus-circle-outline" style={styles.icon} fill="#fff" />
          <Text style={styles.actionText}>Add Event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('All Events')}>
          <Icon name="list-outline" style={styles.icon} fill="#fff" />
          <Text style={styles.actionText}>View Events</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  welcome: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 8,
  },
  eventCard: {
    padding: 16,
    margin: 8,
    backgroundColor: '#1A2138',
  },
  eventName: {
    fontSize: 14,
    color: '#fff',
  },
  eventDetails: {
    fontSize: 12,
    color: '#ccc',
  },
  eventList: {
    paddingHorizontal: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 16,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
