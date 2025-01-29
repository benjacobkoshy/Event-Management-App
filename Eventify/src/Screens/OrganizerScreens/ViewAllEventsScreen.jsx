import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { AuthContext } from '../../context/AuthContext';

export default function ViewAllEventsScreen({ navigation }) {
  const { axiosInstance } = useContext(AuthContext);
  const [events, setEvents] = useState([]); // Store fetched events
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/events/list-organizer-event/');
      setEvents(response.data.events); // Update state with fetched events
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
     // Navigate to event details screen
    >
      <Image source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.eventName}>{item.name}</Text>
        <Text style={styles.eventDate}>{item.start_date}</Text>
        <Text style={styles.eventVenue}>{item.venue}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Layout style={styles.container}>
      <Text style={styles.title}>Your Events</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEventItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noEventsText}>No events found</Text>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 150,
  },
  detailsContainer: {
    padding: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  eventVenue: {
    fontSize: 14,
    color: '#fff',
  },
  noEventsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
