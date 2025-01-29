import { Input, Layout, Text } from '@ui-kitten/components'; 
import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Snackbar from 'react-native-snackbar';

export default function EventDetailsScreen({ navigation, route }) {
  const { axiosInstance } = useContext(AuthContext);
  const [event, setEvent] = useState(null); // State to hold event details
  const [ticketsToBook, setTicketsToBook] = useState('');
  const { eventId } = route.params;

  // Fetch event details on component mount
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axiosInstance.get(`/events/event-details/${eventId}/`);
        setEvent(response.data); // Update state with event data
        // console.log(event)
      } catch (error) {
        Snackbar.show({
          text: 'Failed to fetch event details. Please try again later.',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#f44336',
        });
      }
    };
    fetchEventDetails();
  }, [axiosInstance, eventId]);

  const handleBooking = async () => {
    if (!event) return; // Ensure event data is loaded before proceeding
  
    if (!event.is_verified) { // Fixed the condition (was `event.is_verfied`, corrected to `event.is_verified`)
      Snackbar.show({
        text: 'You must complete the account info.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#f44336',
      });
      return; // Prevent further execution
    }
  
    const tickets = parseInt(ticketsToBook, 10);
  
    if (!tickets || tickets <= 0) {
      Snackbar.show({
        text: 'Please enter a valid number of tickets to book.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#f44336',
      });
      return;
    }
  
    if (tickets > event.ticketsLeft) {
      Snackbar.show({
        text: `Only ${event.ticketsLeft} tickets are available. Please adjust your booking.`,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#f44336',
      });
      return;
    }
  
    // ✅ Corrected navigation
    navigation.navigate('Payment Screen', { 
      tickets: tickets, 
      tickets_price: tickets * event.ticket_price ,
      eventId: eventId
    });
  };
  

  if (!event) {
    return (
      <Layout style={styles.container}>
        <Text style={styles.loadingText}>Loading event details...</Text>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Event Image */}
        <Image source={{ uri: event.image_url }} style={styles.eventImage} />
  
        {/* Event Details */}
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.details}>{event.description}</Text>
  
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date:</Text>
          <Text style={styles.infoValue}>{event.start_date}</Text>
        </View>
  
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>End Date:</Text>
          <Text style={styles.infoValue}>{event.end_date}</Text>
        </View>
  
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Time:</Text>
          <Text style={styles.infoValue}>{event.start_time} - {event.end_time}</Text>
        </View>
  
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Venue:</Text>
          <Text style={styles.infoValue}>{event.venue}</Text>
        </View>
  
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>City:</Text>
          <Text style={styles.infoValue}>{event.city}</Text>
        </View>
  
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ZIP Code:</Text>
          <Text style={styles.infoValue}>{event.zip_code}</Text>
        </View>
  
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Price per Ticket:</Text>
          <Text style={styles.infoValue}>${event.ticket_price}</Text>
        </View>
  
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tickets Left:</Text>
          <Text style={styles.infoValue}>{event.ticketsLeft}</Text>
        </View>
  
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Max Attendees:</Text>
          <Text style={styles.infoValue}>{event.max_attendees}</Text>
        </View>
  
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tags:</Text>
          <Text style={styles.infoValue}>{event.tags}</Text>
        </View>
  
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Organizer Contact:</Text>
          <Text style={styles.infoValue}>{event.contact_email}</Text>
        </View>
  
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{event.contact_phone}</Text>
        </View>
  
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Cancellation Policy:</Text>
          <Text style={styles.infoValue}>{event.cancellation_policy}</Text>
        </View>
  
        {/* Ticket Booking */}
        <Text style={styles.bookingLabel}>Book Your Tickets:</Text>
        <Input
          style={styles.input}
          placeholder="Enter number of tickets"
          keyboardType="numeric"
          value={ticketsToBook}
          onChangeText={setTicketsToBook}
        />
  
        <TouchableOpacity style={styles.button} onPress={handleBooking}>
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
  },
  bookingLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
